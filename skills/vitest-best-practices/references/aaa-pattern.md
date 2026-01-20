# 1.2 AAA Pattern

Structure tests as **Arrange**, **Act**, **Assert**:

```ts
it('should return the default value for an unknown property', () => {
  // Arrange
  const defaultColor: Color = [128, 128, 128, 155];
  const colorLookup = lookup(colorTable, defaultVal(defaultColor));

  // Act
  const actual = colorLookup('UNKNOWN');

  // Assert
  expect(actual).toEqual(defaultColor);
});
```
