import fitCurve from "fit-curve";

type Curve = [Point, Point, Point, Point];
type Point = [number, number];

function vectorNetworkToPoints(vectorNetwork: VectorNetwork): Point[] {
  const segmentMap: { [key: number]: number[] } = {};
  vectorNetwork.segments.forEach((d) => {
    segmentMap[d.start] = [d.end, ...(segmentMap[d.start] || [])];
    segmentMap[d.end] = [d.start, ...(segmentMap[d.end] || [])];
  });

  const segmentEntries = Object.entries(segmentMap);

  const endpoints = segmentEntries
    .filter(([, v]) => v.length === 1)
    .map(([k]) => parseInt(k));
  let start: number, end: number;
  if (endpoints.length === 2) {
    [start, end] = endpoints;
  } else if (endpoints.length === 0) {
    start = end = parseInt(segmentEntries[0][0]);
  } else {
    throw "Not implemented";
  }
  const route = [start, segmentMap[start][0]];
  while (route[route.length - 1] !== end) {
    const [previous, current] = route.slice(-2);
    route.push(segmentMap[current].filter((a) => a !== previous)[0]);
  }
  return route.map((d) => [
    vectorNetwork.vertices[d].x,
    vectorNetwork.vertices[d].y,
  ]);
}

function smoothClosedPath(curves: Curve[]): void {
  const [start] = curves[0];
  const [, , , end] = curves[curves.length - 1];
  const isClosed = start[0] === end[0] && start[1] === end[1];
  if (!isClosed) {
    return;
  }
}

function curvesToVectorNetwork(curves: Curve[]): VectorNetwork {
  const vertices: VectorVertex[] = [];
  const segments: VectorSegment[] = [];
  curves.forEach(([[x0, y0], [x1, y1], [x2, y2], [x3, y3]], index) => {
    if (index === 0) {
      vertices.push({
        x: x0,
        y: y0,
        handleMirroring: "ANGLE",
      });
    }
    vertices.push({
      x: x3,
      y: y3,
      handleMirroring: "ANGLE",
    });
    segments.push({
      start: index,
      end: index + 1,
      tangentStart: { x: x1 - x0, y: y1 - y0 },
      tangentEnd: { x: x2 - x3, y: y2 - y3 },
    });
  });
  return { vertices, segments };
}

export default function (error: number) {
  const vectorNode = figma.currentPage.selection[0];
  if (vectorNode.type !== "VECTOR") {
    throw "Invalid shape type. Should be VECTOR";
  }
  const points = vectorNetworkToPoints(vectorNode.vectorNetwork);
  const curves = fitCurve(points, error);
  smoothClosedPath(curves);

  vectorNode.vectorNetwork = curvesToVectorNetwork(curves);
}
