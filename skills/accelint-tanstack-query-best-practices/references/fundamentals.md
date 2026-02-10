# Core Concepts and Performance

## Terminology

### staleTime
Duration until a query transitions from fresh to stale. Fresh queries never trigger network requests.

- **Fresh query**: Within staleTime window, returns cached data immediately, no network request
- **Stale query**: Past staleTime window, returns cached data but triggers background refetch

Default: `0` (immediately stale)

### gcTime
Duration until inactive queries are removed from cache. Previously called `cacheTime` in v4.

- **Active query**: Has at least one observer (component using the query)
- **Inactive query**: No observers, countdown to garbage collection starts

Default: `5 minutes`

### Observers
Internal subscribers that watch for query state changes. Think event listeners. Each `useQuery` or `useSuspenseQuery` call registers an observer.

When data updates, TanStack Query iterates through all registered observers for that cache entry to determine which components need to re-render.

## Fresh vs Stale Queries

```typescript
// Lookup data: long staleTime
useQuery({
  queryKey: keys.countries(),
  queryFn: fetchCountries,
  staleTime: 1000 * 60 * 60, // Fresh for 1 hour
});
// First render: network request
// Renders within 1 hour: cached data, no network request
// After 1 hour: cached data shown, background refetch triggered

// Real-time data: short staleTime
useQuery({
  queryKey: keys.track(id),
  queryFn: () => fetchTrack(id),
  staleTime: 1000 * 5, // Fresh for 5 seconds
});
// Frequent refetching to stay current
```

## Query State Lifecycle

```
idle → pending → success/error
                    ↓
                  refetching → success/error
```

- **idle**: Query hasn't been triggered yet
- **pending**: Initial fetch in progress
- **success**: Data fetched successfully, cached
- **error**: Fetch failed, error cached
- **refetching**: Background refetch of stale data (still showing old data)

## Structural Sharing

TanStack Query uses structural sharing to prevent unnecessary re-renders. After refetch, performs deep equality check:
- If data is referentially different but structurally identical (same values, different object instances), returns previous reference
- Prevents downstream re-renders when API returns fresh data with identical values

**Complexity:** O(n) where n = number of fields in data structure

### When to Disable Structural Sharing

| Dataset Size | Update Frequency | Recommendation |
|--------------|-----------------|----------------|
| <100 items | Any | Keep enabled (default) |
| 100-1000 items | <1 update/second | Keep enabled |
| 1000-5000 items | >1 update/second | Consider disabling |
| >5000 items | Any | Disable with `structuralSharing: false` |

```typescript
// Large, frequently-changing data
useQuery({
  queryKey: keys.radarContacts(),
  queryFn: fetchRadarContacts,
  staleTime: 1000 * 2,
  structuralSharing: false, // Skip expensive diffing
});
```

### Select Option Double Overhead

When using `select`, structural sharing runs twice:
1. First pass: Compare previous raw data with new raw data
2. Second pass: Compare previous transformed data with new transformed data

For large datasets (>1000 items) with frequent updates, double structural sharing adds overhead. Disable with `structuralSharing: false`.

```typescript
// Stable selector — extract outside hook so reference doesn't change on re-render
const selectSorted = (items: Item[]) => items.sort((a, b) => a.timestamp - b.timestamp);

// Disable structural sharing with select on large data
export function useItemsSorted() {
  return useSuspenseQuery({
    queryKey: keys.all(),
    queryFn: fetchItems,
    select: selectSorted,
    refetchInterval: 1000,
    structuralSharing: false, // Skip double overhead
  });
}
```

## Observer Performance Impact

Each `useQuery` call creates an observer. High observer counts cause O(n) iteration overhead on every cache update.

### Observer Count Thresholds

| Observer Count | Performance Impact | Action Required |
|----------------|-------------------|------------------|
| 1-5 | Negligible | None |
| 6-20 | Minimal | Monitor, no immediate action |
| 21-50 | Noticeable on updates | Consider hoisting queries to parent |
| 51-100 | Significant overhead | Refactor: hoist queries or use select |
| 100+ | Critical impact | Immediate refactor: single query with props distribution |

### Diagnosis with DevTools

1. Open TanStack Query DevTools in development
2. Find cache entries with observer counts >10
3. Identify the query keys with excessive observers
4. Search codebase for query hook calls with those keys
5. Refactor to hoist queries to parent components

### Solution Patterns

**Problem:** N list items, N observers, N requests

```typescript
// ❌ 200 observers, 200 requests
function TrackList({ trackIds }) {
  return trackIds.map(id => <TrackItem key={id} trackId={id} />);
}

function TrackItem({ trackId }) {
  const { data } = useTrack(trackId); // Observer per item
  return <div>{data.name}</div>;
}
```

**Solution 1:** Hoist query to parent

```typescript
// ✅ 1 observer, 1 request
function TrackList({ trackIds }) {
  const { data: tracks } = useAllTracks();
  return trackIds.map(id => {
    const track = tracks.find(t => t.id === id);
    return <TrackItem key={id} track={track} />;
  });
}

function TrackItem({ track }) {
  return <div>{track.name}</div>;
}
```

**Solution 2:** Use select to minimize re-renders

```typescript
const selectTrackName = (track: Track) => track.name;

// ✅ Observers still exist but select reduces re-render frequency
export function useTrackName(id: string) {
  return useSuspenseQuery({
    queryKey: keys.detail(id),
    queryFn: () => fetchTrack(id),
    select: selectTrackName, // Stable reference — only re-renders when name changes
  });
}
```

**Solution 3:** Populate individual caches from list query

```typescript
function TrackList({ trackIds }) {
  const queryClient = getQueryClient();
  const { data: tracks } = useAllTracks();

  // Populate individual track caches from list
  useEffect(() => {
    tracks.forEach(track => {
      queryClient.setQueryData(keys.detail(track.id), track);
    });
  }, [tracks, queryClient]);

  return trackIds.map(id => <TrackItem key={id} trackId={id} />);
}

// Now useTrack(id) returns immediately from pre-populated cache
function TrackItem({ trackId }) {
  const { data } = useTrack(trackId);
  return <div>{data.name}</div>;
}
```

## Background Refetching Strategies

Balance freshness requirements with network efficiency:

### Static Reference Data

```typescript
export function useCountries() {
  return useSuspenseQuery({
    queryKey: keys.all(),
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60, // 1 hour - rarely changes
    gcTime: Infinity, // Keep forever
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
```

### Moderate Freshness

```typescript
export function useUserProfile() {
  return useSuspenseQuery({
    queryKey: keys.current(),
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when user returns
  });
}
```

### Real-Time Data

```typescript
export function useTrack(id: string) {
  return useSuspenseQuery({
    queryKey: keys.detail(id),
    queryFn: () => fetchTrack(id),
    staleTime: 1000 * 5, // 5 seconds
    gcTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 5, // Poll every 5 seconds
    refetchOnWindowFocus: true,
  });
}
```

## Query Deduplication

TanStack Query automatically deduplicates identical queries. When three components request same data simultaneously, one network request is made and result shared across all three.

**How it works:**
- Query key is hashed to create cache entry identifier
- First query hook registers observer and triggers fetch
- Second and third hooks register observers on existing cache entry
- All three hooks receive same data when fetch completes

**No action needed** - automatic behavior. Just ensure consistent query keys across components.

## Important Notes

- Fresh queries (within staleTime) never trigger network requests
- Stale queries return cached data immediately, then trigger background refetch
- gcTime countdown starts when last observer unmounts
- Structural sharing is O(n) - disable for datasets >5000 items with frequent updates
- `select` option doubles structural sharing overhead - disable sharing for large datasets
- Observer counts >50 indicate architectural issues requiring refactoring
- Query deduplication is automatic - focus on consistent query keys
- Tune staleTime/refetchInterval based on data freshness requirements, not one-size-fits-all
- Use TanStack Query DevTools to diagnose observer count and cache issues
