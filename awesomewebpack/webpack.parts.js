const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const webpack = require('webpack');
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");


  exports.devServer = ({ host, port } = {}) => ({
      devServer: {
        stats: "errors-only",
        host, // Defaults to `localhost`
        port, // Defaults to 8080
        open: true,
        overlay: true,
        watchOptions: {
          // Delay the rebuild after the first change
          aggregateTimeout: 300,
    
          // Poll using interval (in ms, accepts boolean too)
          poll: 1000,
        },
      },
  });
  exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
  
          use: ["style-loader", "css-loader"],
        },
      ],
    },
  });
  exports.extractCSS = ({ include, exclude, use = [] }) => {
    // Output extracted CSS to a file
    const plugin = new MiniCssExtractPlugin({
        //filename: "styles/[name].css"
        filename: "[name].[contenthash:4].css",
    });
  
    return {
      module: {
        rules: [
          {
            test: /\.css$/,
            include,
            exclude,
  
            use: [
              MiniCssExtractPlugin.loader,
            ].concat(use),
          },
        ],
      },
      plugins: [plugin],
    };
  };
  exports.purifyCSS = ({ paths }) => ({
    plugins: [new PurifyCSSPlugin({ paths })],
  });
  exports.autoprefix = () => ({
    loader: "postcss-loader",
    options: {
      plugins: () => [require("autoprefixer")()],
    },
  });
  exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
      rules: [
        {
          test: /\.(png|jpg)$/,
          include,
          exclude,
          use: {
            loader: "url-loader",
            options,
          },
        },
      ],
    },
  });
  exports.loadJavaScript = ({ include, exclude } = {}) => ({
    module: {
      rules: [
        {
          test: /\.js$/,
          include,
          exclude,
          //use: "babel-loader",
          use: "happypack/loader",
        },
      ],
    },
  });
  exports.generateSourceMaps = ({ type }) => ({
    devtool: type,
  });
  exports.clean = path => ({
    plugins: [new CleanWebpackPlugin([path])],
  });
//   exports.attachRevision = () => ({
//     plugins: [
//       new webpack.BannerPlugin({
//         banner: new GitRevisionPlugin().version(),
//       }),
//     ],
//   });
  exports.minifyJavaScript = () => ({
    optimization: {
      minimizer: [new UglifyWebpackPlugin({ sourceMap: true })],
    },
  });
  exports.Prepack = ({configuration} = {}) => ({
    plugins: [new PrepackWebpackPlugin([configuration])]
  });
  exports.minifyCSS = ({ options }) => ({
    plugins: [
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: options,
        canPrint: false,
      }),
    ],
  });
  exports.setFreeVariable = (key, value) => {
    const env = {};
    env[key] = JSON.stringify(value);
  
    return {
      plugins: [new webpack.DefinePlugin(env)],
    };
  };
  
  