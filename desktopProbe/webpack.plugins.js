// // webpack.plugins.js
//
// import path from "path";
// import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
// import webpack from "webpack";
// import CopyWebpackPlugin from "copy-webpack-plugin";
//
// export const plugins = [
//   new ForkTsCheckerWebpackPlugin({
//     logger: "webpack-infrastructure",
//   }),
//   new webpack.EnvironmentPlugin([
//     "APP_BUNDLE_ID",
//     "SUPABASE_URL",
//     "SUPABASE_KEY",
//     "MEZMO_API_KEY",
//     "AMPLITUDE_API_KEY",
//   ]),
//   new CopyWebpackPlugin({
//     patterns: [{ from: path.join(__dirname, "images"), to: "images" }],
//   }),
// ];
// webpack.plugins.js

const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new webpack.EnvironmentPlugin([
    "APP_BUNDLE_ID",
    "SUPABASE_URL",
    "SUPABASE_KEY",
    "MEZMO_API_KEY",
    "AMPLITUDE_API_KEY",
  ]),
  new CopyWebpackPlugin({
    patterns: [{ from: path.join(__dirname, "images"), to: "images" }],
  }),
];

module.exports = plugins;
