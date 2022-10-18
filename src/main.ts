import simplify from "./simplify";

const SCALE = 10;

figma.parameters.on(
  "input",
  ({ parameters, key, query, result }: ParameterInputEvent) => {
    switch (key) {
      case "tolerance":
        result.setSuggestions(["1", "2", "5", "10"]);
        break;
      default:
        return;
    }
  }
);
figma.on("run", ({ parameters }: RunEvent) => {
  console.log(parameters);
  simplify(parseInt(parameters.tolerance));
  figma.closePlugin();
});
