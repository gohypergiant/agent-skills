# Performance Patterns

## 1. Layer instantiation in render is normal

**Key rule:** deck.gl creates a new JavaScript layer instance each render and then diffs it against the previous layer with the same stable `id`. Do not optimize away `new TextLayer()` unless other props are unstable.

**❌ Incorrect: blaming render-time instantiation itself**
```tsx
function Map({data}: {data: Point[]}) {
  const layers = [
    new TextLayer({
      id: 'labels',
      data,
      getText: d => d.label
    })
  ];

  return <DeckGL layers={layers} />;
}
```

Bad review comment: "This creates a new TextLayer on every render, so it re-renders too much."

**✅ Correct: review the real invalidation sources**
```tsx
function Map({data}: {data: Point[]}) {
  const layers = [
    new TextLayer({
      id: 'labels',
      data,
      getText: d => d.label
    })
  ];

  return <DeckGL layers={layers} />;
}
```

Correct review comment: "Layer instantiation here is normal. Verify that `id` is stable, `data` is not recreated unnecessarily, and accessors only invalidate when needed."

## 2. Keep data references stable

**❌ Incorrect: inline filtering recreates data every render**
```tsx
new ScatterplotLayer({
  id: 'points',
  data: DATA.filter(d => d.time >= minTime && d.time <= maxTime),
  getPosition: d => d.position
})
```

**Why this hurts:** a fresh array reference makes deck.gl rebuild attributes for the whole layer.

**✅ Correct: memoize derived data**
```tsx
const filteredData = useMemo(
  () => DATA.filter(d => d.time >= minTime && d.time <= maxTime),
  [minTime, maxTime]
);

new ScatterplotLayer({
  id: 'points',
  data: filteredData,
  getPosition: d => d.position
})
```

## 3. Use updateTriggers instead of rebuilding rows

**❌ Incorrect: remap data just to change radius**
```tsx
const data = useMemo(
  () => DATA.map(d => ({centroid: d.centroid, population: d.populationsByYear[year]})),
  [year]
);

new ScatterplotLayer({
  id: 'points',
  data,
  getPosition: d => d.centroid,
  getRadius: d => Math.sqrt(d.population)
})
```

**✅ Correct: preserve data, invalidate only the accessor**
```tsx
new ScatterplotLayer({
  id: 'points',
  data: DATA,
  getPosition: d => d.centroid,
  getRadius: d => Math.sqrt(d.populationsByYear[year]),
  updateTriggers: {
    getRadius: year
  }
})
```

## 4. Prefer `visible` over removing layers

**❌ Incorrect: conditional removal discards buffers**
```tsx
const layers = [
  showLabels && new TextLayer({id: 'labels', data, getText: d => d.label})
];
```

**✅ Correct: keep the layer and toggle visibility**
```tsx
const layers = [
  new TextLayer({
    id: 'labels',
    data,
    visible: showLabels,
    getText: d => d.label
  })
];
```

## 5. Use constants and cheap accessors

**❌ Incorrect: per-row allocation for constant color**
```ts
getFillColor: () => [255, 0, 0, 128]
```

**✅ Correct: use constant accessor value**
```ts
getFillColor: [255, 0, 0, 128]
```

**❌ Incorrect: expensive repeated derivation inside accessors**
```ts
getRadius: d => Math.sqrt(Math.max(...Object.values(d.populationsByYear)))
```

**✅ Correct: precompute once, read cheaply**
```ts
const maxPopulationByIndex = DATA.map(d => {
  let max = 0;
  for (const year in d.populationsByYear) {
    max = Math.max(max, d.populationsByYear[year]);
  }
  return max;
});

getRadius: (_, {index}) => Math.sqrt(maxPopulationByIndex[index])
```

## 6. Animate with scale props when possible

**❌ Incorrect: invalidate radius accessor every frame**
```ts
getRadius: d => d.size * radius,
updateTriggers: {getRadius: radius}
```

**✅ Correct: keep accessor stable and animate scale**
```ts
getRadius: d => d.size,
radiusScale: radius
```

## 7. Stream data without rebuilding old chunks

**❌ Incorrect: concat all loaded data repeatedly**
```ts
setLoadedData(current => current.concat(chunk));
```

**✅ Correct: append chunks as separate layers**
```ts
setDataChunks(current => current.concat([chunk]));

const layers = dataChunks.map((chunk, index) =>
  new ScatterplotLayer({
    id: `points-${index}`,
    data: chunk,
    getPosition: d => d.position
  })
);
```

**✅ Also correct: use async iterable data**
```ts
async function* getData() {
  let chunk;
  while ((chunk = await fetchNextChunk())) {
    yield chunk;
  }
}

new ScatterplotLayer({
  id: 'points',
  data: getData(),
  getPosition: d => d.position
})
```

## 8. Escalate to binary/external attributes when row objects are the bottleneck

When datasets are huge or change frequently, object materialization and CPU-side attribute generation can dominate. In those cases, prefer typed arrays, worker-precomputed attributes, or external attributes over JS object arrays.
