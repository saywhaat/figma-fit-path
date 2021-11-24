export type Point = [number, number];

///

interface SolidFill {
  type: "solid";
  color: string;
}

export interface PatternFill {
  type: "pattern";
  pattern: string[];
  colors: { [key: string]: string };
  cellSize: number;
}

type Fill = SolidFill | PatternFill;

interface BaseStroke {
  width?: number;
  color: string;
}

interface SolidStroke extends BaseStroke {
  type: "solid";
}

interface DashedStroke extends BaseStroke {
  type: "dashed";
  dash: number[];
}

interface DottedStroke extends BaseStroke {
  type: "dotted";
  gap: number;
}

interface RailwayStroke extends BaseStroke {
  type: "railway";
  dash: number[];
  outlineWidth: number;
}

type Stroke = SolidStroke | DashedStroke | DottedStroke | RailwayStroke;

interface BaseDefinition {
  id: string;
  name: string;
}

interface LineDefinition extends BaseDefinition {
  type: "L";
  stroke: Stroke;
}

interface AreaDefinition extends BaseDefinition {
  type: "A";
  fill: Fill;
  stroke?: Stroke;
}

export type SymbolDefinition = LineDefinition | AreaDefinition;
