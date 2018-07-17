const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const path = require("path");
const glob = require("glob");
const webpack = require('webpack');
var SystemBellPlugin = require('system-bell-webpack-plugin');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const merge = require("webpack-merge");
const parts = require("./webpack.parts.js");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const HappyPack = require("happypack");
const PATHS = {
  app: path.join(__dirname, "src"),
  build: path.join(__dirname, "dist"),
};
const configuration = {};
const commonConfig = merge([
  {
    plugins: [
      new HappyPack({
        loaders: [
          // Capture Babel loader
          "babel-loader"
        ],
      }),
      new HtmlWebpackPlugin({
        title: "Webpack demo",
      }),
      new ErrorOverlayPlugin(),
      new SystemBellPlugin(),
      //new PreloadWebpackPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new webpack.WatchIgnorePlugin([
        path.join(__dirname, "node_modules")
      ]),
      
    ],
  },
  //parts.loadCSS()
  parts.loadJavaScript({ include: PATHS.app }),
  parts.setFreeVariable("HELLO", "webpack"),
]);
const productionConfig = merge([
  {recordsPath: path.join(__dirname, "records.json")},
  {
    performance: {
      hints: "warning", // "error" or false are valid too
      maxEntrypointSize: 50000, // in bytes, default 250k
      maxAssetSize: 450000, // in bytes
    },
  },
  {
    output: {
      publicPath: "/https://github.com/awesomepeng/",
      chunkFilename: "[name].[chunkhash:4].js",
      filename: "[name].[chunkhash:4].js",
    },
  },
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      //safe: true,
    },
  }),
  //parts.attachRevision(),
  //parts.Prepack({}),
  parts.clean(PATHS.build),
  parts.generateSourceMaps({ type: "source-map" }),
  parts.minifyJavaScript(),
  parts.extractCSS({
    //use: "css-loader",
    use: ["css-loader", parts.autoprefix()],
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      //name: "[name].[ext]",
      name: "[name].[hash:4].[ext]",
    },
  }),
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          },
        },
      },
      runtimeChunk: {
        name: "manifest",
      },
    }}
]);
const developmentConfig = merge([
  parts.loadCSS(),
  parts.loadImages(),
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: "8189",
  }),
]);
module.exports = mode => {
  if (mode === "production") {
    return smp.wrap(merge(commonConfig, productionConfig, { mode }));
  }

  return smp.wrap(merge(commonConfig, developmentConfig, { mode }));
};


// module.exports = {
//   // entry: 'index.js',
//   // output: {
//   //   path: __dirname + '/dist',
//   //   filename: 'main.js',
//   // },
//   devServer: {
//     // Display only errors to reduce the amount of output.
//     stats: "errors-only",

//     // Parse host and port from env to allow customization.
//     //
//     // If you use Docker, Vagrant or Cloud9, set
//     // host: options.host || "0.0.0.0";
//     //
//     // 0.0.0.0 is available to all network devices
//     // unlike default `localhost`.
//     host: process.env.HOST, // Defaults to `localhost`
//     port: "8189", // Defaults to 8080
//     open: true, // Open the page in browser
//     overlay:true,
    
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       title: "Webpack demo",
//     }),
   
//     // new PreloadWebpackPlugin(),
//     // new BrowserSyncPlugin({
//     //   // browse to http://localhost:3000/ during development,
//     //   // ./public directory is being served
//     //   host: 'localhost',
//     //   port: 3000,
//     //   server: { baseDir: ['dist'] },
//     //   //proxy: 'http://localhost:8189/'
//     // },{
//     //   // prevent BrowserSync from reloading the page
//     //   // and let Webpack Dev Server take care of this
//     //   reload: false
//     // })
//   ]
// };