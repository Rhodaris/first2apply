import type { Configuration, PathData, AssetInfo } from "webpack";

import { rules } from "./webpack.rules.ts";
import { plugins } from "./webpack.plugins.ts";

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".ts", ".js", ".jsx", ".tsx", ".css", ".json"],
  },
};
