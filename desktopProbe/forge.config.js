// // forge.config.js
//
// //import { MakerAppX } from '@electron-forge/maker-appx';
// import { MakerDeb } from '@electron-forge/maker-deb';
// import { MakerDMG } from '@electron-forge/maker-dmg';
// import { MakerSquirrel } from '@electron-forge/maker-squirrel';
// import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
// import { WebpackPlugin } from '@electron-forge/plugin-webpack';
// import { config as loadEnvVars } from 'dotenv';
// //import path from "path";
//
// // If you've converted these configs to JS, point to their .js files accordingly
// import { mainConfig } from './webpack.main.config.js';
// import { rendererConfig } from './webpack.renderer.config.js';
//
// const path = require('path');
// const { MakerAppX } = require('@electron-forge/maker-appx');
//
// // Load environment variables
// loadEnvVars({ path: path.join(__dirname, '..', 'desktopProbe', '.env') });
//
// const config = {
//   packagerConfig: {
//     asar: true,
//     icon: path.join(__dirname, 'packagers', 'icons', 'paper-plane'),
//     appBundleId: process.env.APP_BUNDLE_ID,
//     protocols: [
//       {
//         name: 'First 2 Apply',
//         schemes: ['first2apply'],
//       },
//     ],
//     osxSign: {},
//     osxNotarize: {
//       appleId: process.env.APPLE_ID ?? '',
//       appleIdPassword: process.env.APPLE_PASSWORD ?? '',
//       teamId: process.env.APPLE_TEAM_ID ?? '',
//     },
//   },
//   rebuildConfig: {},
//   makers: [
//     new MakerSquirrel({
//       authors: 'BeastX Industries',
//       name: 'f2a',
//       setupIcon: path.join(__dirname, 'packagers', 'icons', 'paper-plane.ico'),
//     }),
//     new MakerDMG({
//       format: 'ULFO',
//       background: path.join(__dirname, 'packagers', 'macos-dmg-background.png'),
//       additionalDMGOptions: {
//         window: {
//           size: {
//             width: 658,
//             height: 498,
//           },
//         },
//       },
//     }),
//     new MakerAppX({
//       packageName: 'BeastXIndustries.First2Apply',
//       publisher: 'CN=A2CA7EBA-28F4-4422-B08E-763EC4EEEACE',
//       makeVersionWinStoreCompatible: true,
//       // @ts-ignore: Only relevant in TS, safe to remove or keep as a comment
//       publisherDisplayName: 'BeastX Industries',
//       assets: './packagers/appx/icons',
//       manifest: './packagers/appx/AppXManifest.xml',
//     }),
//     new MakerDeb({
//       options: {
//         name: 'First 2 Apply',
//         bin: 'First 2 Apply',
//         icon: path.join(__dirname, 'packagers', 'icons', 'paper-plane.png'),
//         mimeType: ['x-scheme-handler/first2apply'],
//       },
//     }),
//     {
//       name: '@electron-forge/maker-zip',
//       config: (arch) => ({
//         macUpdateManifestBaseUrl: `https://s3.eu-central-1.amazonaws.com/first2apply.com/releases/darwin/${arch}`,
//       }),
//     },
//   ],
//   publishers: [
//     {
//       name: '@electron-forge/publisher-s3',
//       config: {
//         bucket: 'first2apply.com',
//         region: 'eu-central-1',
//         public: true,
//         keyResolver: (fileName, platform, arch) => {
//           return `releases/${platform}/${arch}/${fileName}`;
//         },
//       },
//     },
//   ],
//   plugins: [
//     new AutoUnpackNativesPlugin({}),
//     new WebpackPlugin({
//       devContentSecurityPolicy:
//           "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;",
//       mainConfig,
//       renderer: {
//         config: rendererConfig,
//         entryPoints: [
//           {
//             html: './src/index.html',
//             js: './src/renderer.ts', // if you've renamed renderer.ts -> renderer.js
//             name: 'main_window',
//             preload: {
//               js: './src/preload.ts', // if you've renamed preload.ts -> preload.js
//             },
//           },
//         ],
//       },
//       port: 3049,
//     }),
//   ],
// };
// module.exports = config;
// //export default config;
// forge.config.js

const path = require('path');
const { config: loadEnvVars } = require('dotenv');

const MakerDebImported = require('@electron-forge/maker-deb');
const MakerDeb = MakerDebImported.default ? MakerDebImported.default : MakerDebImported;


// Use a fallback for MakerDMG
const MakerDMGImported = require('@electron-forge/maker-dmg');
const MakerDMG = MakerDMGImported.default ? MakerDMGImported.default : MakerDMGImported;

// Use a fallback for MakerSquirrel as well
const MakerSquirrelImported = require('@electron-forge/maker-squirrel');
const MakerSquirrel = MakerSquirrelImported.default ? MakerSquirrelImported.default : MakerSquirrelImported;

const AutoUnpackNativesPluginImported = require('@electron-forge/plugin-auto-unpack-natives');
const AutoUnpackNativesPlugin = AutoUnpackNativesPluginImported.default
    ? AutoUnpackNativesPluginImported.default
    : AutoUnpackNativesPluginImported;

const WebpackPluginImported = require('@electron-forge/plugin-webpack');
const WebpackPlugin = WebpackPluginImported.default ? WebpackPluginImported.default : WebpackPluginImported;

const { MakerAppX } = require('@electron-forge/maker-appx');

const { mainConfig } = require('./webpack.main.config.js');
const { rendererConfig } = require('./webpack.renderer.config.js');

// Load environment variables
loadEnvVars({ path: path.join(__dirname, '..', 'desktopProbe', '.env') });

const config = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'packagers', 'icons', 'paper-plane'),
    appBundleId: process.env.APP_BUNDLE_ID,
    protocols: [
      {
        name: 'First 2 Apply',
        schemes: ['first2apply'],
      },
    ],
    osxSign: {},
    osxNotarize: {
      appleId: process.env.APPLE_ID || '',
      appleIdPassword: process.env.APPLE_PASSWORD || '',
      teamId: process.env.APPLE_TEAM_ID || '',
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      authors: 'BeastX Industries',
      name: 'f2a',
      setupIcon: path.join(__dirname, 'packagers', 'icons', 'paper-plane.ico'),
    }),
    new MakerDMG({
      format: 'ULFO',
      background: path.join(__dirname, 'packagers', 'macos-dmg-background.png'),
      additionalDMGOptions: {
        window: {
          size: {
            width: 658,
            height: 498,
          },
        },
      },
    }),
    new MakerAppX({
      packageName: 'BeastXIndustries.First2Apply',
      publisher: 'CN=A2CA7EBA-28F4-4422-B08E-763EC4EEEACE',
      makeVersionWinStoreCompatible: true,
      // This comment is for TS; in CommonJS it's safe to simply leave it
      publisherDisplayName: 'BeastX Industries',
      assets: './packagers/appx/icons',
      manifest: './packagers/appx/AppXManifest.xml',
    }),
    new MakerDeb({
      options: {
        name: 'First 2 Apply',
        bin: 'First 2 Apply',
        icon: path.join(__dirname, 'packagers', 'icons', 'paper-plane.png'),
        mimeType: ['x-scheme-handler/first2apply'],
      },
    }),
    {
      name: '@electron-forge/maker-zip',
      config: (arch) => ({
        macUpdateManifestBaseUrl: `https://s3.eu-central-1.amazonaws.com/first2apply.com/releases/darwin/${arch}`,
      }),
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-s3',
      config: {
        bucket: 'first2apply.com',
        region: 'eu-central-1',
        public: true,
        keyResolver: (fileName, platform, arch) => {
          return `releases/${platform}/${arch}/${fileName}`;
        },
      },
    },
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      devContentSecurityPolicy:
          "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;",
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts', // if you've renamed renderer.ts -> renderer.js, update here
            name: 'main_window',
            preload: {
              js: './src/preload.ts', // update if renamed to .js
            },
          },
        ],
      },
      port: 3049,
    }),
  ],
};

module.exports = config;
