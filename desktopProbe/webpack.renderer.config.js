// // webpack.renderer.config.js
//
// import path from "path";
// import { rules } from "./webpack.rules.js";
// import { plugins } from "./webpack.plugins.js";
//
// rules.push({
//   test: /\.css$/,
//   use: [
//     { loader: "style-loader" },
//     { loader: "css-loader" },
//     { loader: "postcss-loader" },
//   ],
// });
//
// export const rendererConfig = {
//   module: {
//     rules,
//   },
//   plugins,
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//     extensions: [".ts", ".js", ".jsx", ".tsx", ".css"],
//   },
// };
const path = require('path');
const rules  = require('./webpack.rules.js');
const { plugins } = require('./webpack.plugins.js');

// Create a fresh copy of the rules for the renderer and then add the CSS rule.
// const rendererRules = [
//   ...rules,
//   {
//     test: /\.css$/,
//     use: [
//       { loader: 'style-loader' },
//       { loader: 'css-loader' },
//       { loader: 'postcss-loader' },
//     ],
//   },
// ];
 const rendererRules = [...rules]; // No additional CSS rule if the plugin already adds one.

rendererRules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    { loader: 'postcss-loader' },
  ],
});

const rendererConfig = {
  module: {
    rules: rendererRules,
  },
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js', '.jsx', '.tsx', '.css'],
  },
};

module.exports = { rendererConfig };