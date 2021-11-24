const fitStartingPointCurves = require("./fitStartingPointCurves").default;

test("!", () => {
  const fitted = fitStartingPointCurves([13, 8], [2, 6], [12, 1]);
  expect(fitted).toBe([
    [5, 12],
    [15, 7],
  ]);
});
