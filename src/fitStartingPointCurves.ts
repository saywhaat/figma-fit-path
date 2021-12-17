import { Point } from "./types";

export default function fitStartingPointCurves(
  x0: Point,
  x1: Point,
  x2: Point
): [Point, Point] {
  const v0 = [x2[0] - x1[0], x2[1] - x1[1]];
  const v1 = [x1[0] - x0[0], x1[1] - x0[1]];
  const v2 = [x2[0] - x0[0], x2[1] - x0[1]];

  const l0 = v0[0] * v0[0] + v0[1] * v0[1];
  const a1 = v0[0] * v1[0] + v0[1] * v1[1];
  const a2 = v0[0] * v2[0] + v0[1] * v2[1];

  return [
    [x0[0] + (v0[0] * a1) / l0, x0[1] + (v0[1] * a1) / l0],
    [x0[0] + (v0[0] * a2) / l0, x0[1] + (v0[1] * a2) / l0],
  ];
}
