// webpack.main.config.js

// import { rules } from "./webpack.rules.js";
// import { plugins } from "./webpack.plugins.js";

// const rules = require('./webpack.rules.js');
// const plugins = require('./webpack.plugins.js');
//
// export const mainConfig = {
//   // This is the main entry point for your application, the first file that runs in the main process.
//   entry: "./src/index.ts",
//   // Put your normal webpack config below here
//   module: {
//     rules,
//   },
//   plugins,
//   resolve: {
//     extensions: [".ts", ".js", ".jsx", ".tsx", ".css", ".json"],
//   },
// };

const rules = require('./webpack.rules.js');
const plugins = require('./webpack.plugins.js');

const mainConfig = {
  // This is the main entry point for your application, the first file that runs in the main process.
  entry: './src/index.ts',

  // Put your normal webpack config below here
  module: {
    // Clone the rules array to avoid accidental mutations
    rules: [...rules],
  },
  plugins: [...plugins],
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx', '.css', '.json'],
  },
};

// Export mainConfig under CommonJS
module.exports = { mainConfig };