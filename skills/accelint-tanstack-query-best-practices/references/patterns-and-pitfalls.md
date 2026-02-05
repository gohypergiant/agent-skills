# Implementation Patterns and Pitfalls

## State Synchronization

### Anti-Pattern: Copying Query Data to useState

**Problem:** Copying TanStack Query data into `useState` creates two sources of truth. TanStack Query updates its cache in background (refetches, invalidations, optimistic updates). If you've copied data into `useState`, local copy doesn't know about these updates. UI shows stale data and user thinks their save didn't work.

**❌ Incorrect: synchronizing to state**
```typescript
function Component() {
  const { data } = useTracks();
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);
  // Background refetch updates 'data' but 'localData' is stale
}
```

**Why This Fails:** Background refetches, retries, and cache invalidations all update query data without component knowledge. Copying to `useState` creates stale local copy, causing "my save didn't work" bugs.

**✅ Correct Pattern: Use Query Data Directly**
```typescript
function Component() {
  const { data } = useTracks();
  const processedData = useMemo(() => transform(data), [data]);
  // Single source of truth - automatically updates
}
```

**When to Use:** Always use query data directly or derive with `useMemo`. Never copy to `useState`.

## Observer Optimization

### Anti-Pattern: Query in Every List Item

**Problem:** Each `useSuspenseQuery` call registers an observer on cache entry. List of 200 items, each calling `useTrack(id)`, creates 200 observers. Every time *any* track query updates, TanStack Query iterates all 200 to check if they need to re-render. If each item has unique query key, you're also making 200 separate network requests instead of one.

**❌ Incorrect: query in every list item**
```typescript
function TrackList({ trackIds }) {
  return trackIds.map(id => <TrackItem key={id} trackId={id} />);
}

function TrackItem({ trackId }) {
  const { data } = useTrack(trackId); // Called N times - N observers, N requests
  return <div>{data.name}</div>;
}
```

**Why This Fails:** Creates O(n) network requests and O(n) observer iteration overhead on every cache update.

**✅ Correct Pattern: Single Query in Parent**
```typescript
function TrackList({ trackIds }) {
  const { data: tracks } = useAllTracks(); // One query, one observer, one request
  return trackIds.map(id => {
    const track = tracks.find(t => t.id === id);
    return <TrackItem key={id} track={track} />;
  });
}

function TrackItem({ track }) {
  return <div>{track.name}</div>;
}
```

**When to Use:** Hoist queries to parent components and pass data as props. One query with one observer is almost always better than N queries with N observers when data comes from same source. See [fundamentals.md#observer-performance-impact](fundamentals.md#observer-performance-impact) for detailed thresholds.

## Query Key Stability

### Anti-Pattern: Unstable Query Keys

**Problem:** Query keys that change between renders with same props create infinite cache entries and duplicate requests.

**❌ Incorrect: unstable keys**
```typescript
// New array instance on every render
queryKey: ['tracks', ...trackIds]

// Temporal value creates infinite unique keys
queryKey: ['events', Date.now()]

// Object without stable serialization
queryKey: ['items', filters] // New object reference each render
```

**Why This Fails:** TanStack Query hashes keys to identify cache entries. Unstable keys create new cache entries on every render, bypassing cache and making duplicate requests.

**✅ Correct Pattern: Stable, Deterministic Keys**
```typescript
// Deterministic serialization
queryKey: ['tracks', trackIds.sort().join(',')]

// Stable identifier instead of temporal value
queryKey: ['events', { since: lastEventId }]

// Stable object serialization
queryKey: ['items', JSON.stringify(filters)]
```

**When to Use:** Always ensure query keys are deterministic. Sort arrays before joining, use stable identifiers instead of temporal values, serialize objects consistently. See [query-keys.md](query-keys.md) for factory patterns.

## Dependent Queries

### Anti-Pattern: Missing Enabled Guards

**Problem:** Dependent queries without `enabled` guards fire with undefined parameters, creating garbage cache entries and wasted requests.

**❌ Incorrect: no enabled guard**
```typescript
// data-access/tracks/client.ts
export function useUserTracks(userId: string | undefined) {
  return useSuspenseQuery({
    queryKey: keys.userTracks(userId!),
    queryFn: () => fetchUserTracks(userId!),
    // No enabled guard - fires immediately with undefined
  });
}
```

**Why This Fails:**
1. Creates garbage cache entry `['tracks', undefined]`
2. Makes wasted network request with invalid parameter
3. When userId arrives, fires again with `['tracks', 'actual-id']`
4. Now two cache entries exist

**✅ Correct Pattern 1: Component Composition (Preferred)**
```typescript
export function useUserTracks(userId: string) {
  return useSuspenseQuery({ // No undefined possible
    queryKey: keys.userTracks(userId),
    queryFn: () => fetchUserTracks(userId),
  });
}

// Component only mounts when userId exists
function UserProfile() {
  const { data: user } = useUser();

  return (
    <div>
      <h1>{user.name}</h1>
      <Suspense fallback={<div>Loading tracks...</div>}>
        <UserTracks userId={user.id} />
      </Suspense>
    </div>
  );
}

function UserTracks({ userId }: { userId: string }) {
  const { data: tracks } = useUserTracks(userId); // userId guaranteed to exist
  return <ul>{tracks.map(t => <li key={t.id}>{t.name}</li>)}</ul>;
}
```

**✅ Correct Pattern 2: Enabled Guard**
```typescript
export function useUserTracks(userId: string | undefined) {
  return useQuery({ // useQuery (not Suspense) for conditional fetching
    queryKey: keys.userTracks(userId!),
    queryFn: () => fetchUserTracks(userId!),
    enabled: Boolean(userId), // Don't run until we have user ID
  });
}

// Component usage
function Component() {
  const { data: user } = useUser();
  const { data: tracks } = useUserTracks(user?.id);
}
```

**When to Use:** Prefer component composition with `useSuspenseQuery` for cleaner code. Use `enabled` guards with `useQuery` when component composition isn't feasible.

## Query Cancellation

### Anti-Pattern: Missing AbortController Signal

**Problem:** Without AbortController signal support, unmounted components leave in-flight requests running. Wastes bandwidth and potentially updates stale cache entries after component unmounted.

**❌ Incorrect: no signal support**
```typescript
export function useData() {
  return useSuspenseQuery({
    queryKey: keys.all(),
    queryFn: () => $fetch('/api/data'), // No signal
  });
}
```

**Why This Fails:** When component unmounts or query key changes, fetch continues running. Wastes network resources and may update cache after user navigated away.

**✅ Correct Pattern: Pass Signal Through**
```typescript
export function useData() {
  return useSuspenseQuery({
    queryKey: keys.all(),
    queryFn: ({ signal }) => $fetch('/api/data', { signal }),
  });
}
```

**When to Use:** Always pass AbortController signal to fetch requests. TanStack Query provides the signal and aborts when component unmounts, query key changes, or query is manually cancelled.

## Custom Hooks and Closures

### Anti-Pattern: Inline Query Definitions

**Problem:** Inline query definitions where `queryFn` references component-scope variables capture whatever value variable had at render time. When query key changes and triggers refetch, `queryFn` still uses old closure value.

**❌ Incorrect: inline with closure bug**
```typescript
function Component({ trackId }) {
  const userId = useUserId();

  const { data } = useSuspenseQuery({
    queryKey: keys.detail(trackId),
    queryFn: () => fetchTrack(trackId, userId), // Captures userId at render time
  });
  // When trackId changes, queryFn still uses old userId
}
```

**Why This Fails:** Closure captures stale variables. When query key changes and triggers refetch, `queryFn` uses the captured value from original render, not current value.

**✅ Correct Pattern: Custom Hook with Fresh Parameters**
```typescript
// data-access/tracks/client.ts
export function useTrack(id: string, userId: string) {
  return useSuspenseQuery({
    queryKey: keys.detail(id),
    queryFn: () => fetchTrack(id, userId), // Fresh values on each render
  });
}

// Component
function Component({ trackId }) {
  const userId = useUserId();
  const { data } = useTrack(trackId, userId);
}
```

**When to Use:** Always wrap queries in custom hooks. Benefits:
- Prevents closure bugs where queryFn captures stale variables
- Centralized query configuration
- Consumers don't need to know query keys
- Easy to update query options in one place
- Better testability

## Data Transformation

### Pattern: Use select Option

Use `select` option instead of `useMemo` for data transformation:

**❌ Incorrect: transform in component**
```typescript
function Component() {
  const { data } = useItems();
  const sorted = useMemo(
    () => data.sort((a, b) => a.timestamp - b.timestamp),
    [data]
  );
}
```

**✅ Correct: transform in select within custom hook**
```typescript
// data-access/items/client.ts
export function useItemsSorted() {
  return useSuspenseQuery({
    queryKey: keys.all(),
    queryFn: fetchItems,
    select: (items) => items.sort((a, b) => a.timestamp - b.timestamp),
  });
}

// Component usage
function Component() {
  const { data } = useItemsSorted();
}
```

**When to Use:** `select` only runs when data exists (no undefined checks with `useSuspenseQuery`) and sits next to query definition.

**Warning:** For datasets >1000 items with frequent updates, `select` causes double structural sharing overhead. See [fundamentals.md#select-option-double-overhead](fundamentals.md#select-option-double-overhead).

## Query Options Per Data Type

### Pattern: Tune Configuration Based on Data Characteristics

Don't rely solely on global defaults. Tune based on data characteristics in custom hooks:

```typescript
// data-access/countries/client.ts
export function useCountries() {
  return useSuspenseQuery({
    queryKey: keys.all(),
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60, // 1 hour - rarely changes
    gcTime: Infinity, // Keep forever
  });
}

// data-access/tracks/client.ts
export function useTrack(id: string) {
  return useSuspenseQuery({
    queryKey: keys.detail(id),
    queryFn: () => fetchTrack(id),
    staleTime: 1000 * 5, // 5 seconds - real-time
    gcTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 5, // Poll every 5 seconds
  });
}

// data-access/radar/client.ts
export function useRadarContacts() {
  return useSuspenseQuery({
    queryKey: keys.all(),
    queryFn: fetchRadarContacts,
    staleTime: 1000 * 2, // 2 seconds
    structuralSharing: false, // Skip expensive diffing for large datasets
  });
}
```

**When to Use:** Match staleTime to business requirements. Lookup tables can have 1-hour staleTime. Real-time tracking needs 5-second staleTime with refetchInterval. See SKILL.md for decision matrix.

## Query Key Dependencies

### Pattern: Treat Query Keys as Dependency Arrays

Query keys should include all variables that affect the fetch:

```typescript
// data-access/tracks/client.ts
export function useTrack(id: string) {
  return useSuspenseQuery({
    queryKey: keys.detail(id), // Automatically refetches when id changes
    queryFn: () => fetchTrack(id),
  });
}

// Component usage
function TrackDetails({ trackId }: { trackId: string }) {
  const { data } = useTrack(trackId);
}
```

**Important:** Query keys are deterministically hashed. These create different cache entries:
- `['tracks', 1]` (number)
- `['tracks', '1']` (string)

**❌ Incorrect: missing dependencies**
```typescript
// data-access/items/client.ts
export function useItems(filters: Filters) {
  return useSuspenseQuery({
    queryKey: keys.all(), // Missing filters!
    queryFn: () => fetchItems(filters),
  });
}
// Query doesn't refetch when filters change
```

**✅ Correct: include all dependencies**
```typescript
// data-access/items/client.ts
export function useItems(filters: Filters) {
  return useSuspenseQuery({
    queryKey: keys.list(filters),
    queryFn: () => fetchItems(filters),
  });
}
```

**When to Use:** Always include all fetch dependencies in query keys. See [query-keys.md](query-keys.md) for factory patterns.

## Important Notes

- Query data is the source of truth - don't copy to useState
- Hoist queries to parent when list items need same data
- Query keys must be deterministic and stable
- Dependent queries need `enabled` guards or component composition
- Always pass AbortController signal to fetch
- Custom hooks prevent closure bugs and provide encapsulation
- Use component composition with `useSuspenseQuery` for cleaner dependent queries
- Tune staleTime/gcTime based on data characteristics, not one-size-fits-all
- Observer counts >50 indicate architectural issues requiring refactoring
