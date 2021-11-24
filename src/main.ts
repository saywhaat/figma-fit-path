import simplify from "./simplify";
// import symbols, { SymbolDefinition } from "./spec";
import getOrCreateStyle from "./getOrCreateStyle";
import getSymbolPreviewIcon from "./getSymbolPreviewIcon";
import symbolDefinitions from "./isom_2017-2";

const SCALE = 10;

figma.parameters.on(
  "input",
  ({ parameters, key, query, result }: ParameterInputEvent) => {
    switch (key) {
      case "simplifyError":
        result.setSuggestions(["1", "2", "5", "10"]);
        break;
      case "symbolId":
        result.setSuggestions(
          symbolDefinitions.map((d) => ({
            name: `${d.id} ${d.name}`,
            data: d.id,
            icon: getSymbolPreviewIcon(d),
          }))
        );
        break;
      default:
        return;
    }
  }
);
figma.on("run", ({ command, parameters }: RunEvent) => {
  switch (command) {
    case "simplify":
      simplify(parseInt(parameters.simplifyError));
      break;
    case "symbol":
      const node = figma.currentPage.selection[0];
      if (
        node.type !== "VECTOR" &&
        node.type !== "RECTANGLE" &&
        node.type !== "BOOLEAN_OPERATION"
      ) {
        throw "Invalid shape type";
      }
      const symbolDefinition = symbolDefinitions.find(
        (d) => d.id === parameters.symbolId
      );
      if (!symbolDefinition) {
        return;
      }
      if (symbolDefinition.type === "L") {
        const { stroke } = symbolDefinition;
        node.strokeStyleId = getOrCreateStyle(symbolDefinition, SCALE);
        if (stroke.width) {
          node.strokeWeight = stroke.width * SCALE;
        }
        if (stroke.type === "solid") {
          node.dashPattern = [];
        } else if (stroke.type === "dashed") {
          node.dashPattern = stroke.dash.map((d) => d * SCALE);
        } else if (stroke.type === "dotted") {
          node.dashPattern = [0.01, stroke.gap * SCALE];
          node.strokeCap = "ROUND";
          node.strokeJoin = "ROUND";
        } else if (stroke.type === "railway") {
          const { parent } = node;
          const dashNode = node.clone();
          parent.appendChild(dashNode);
          node.strokeWeight = (stroke.width + stroke.outlineWidth * 2) * SCALE;
          dashNode.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
          dashNode.strokeWeight = stroke.width * SCALE;
          dashNode.dashPattern = stroke.dash.map((d) => d * SCALE);
        }
      } else if (symbolDefinition.type === "A") {
        node.fillStyleId = getOrCreateStyle(symbolDefinition, SCALE);
      }

      break;

    default:
      return;
  }
  figma.closePlugin();
});
