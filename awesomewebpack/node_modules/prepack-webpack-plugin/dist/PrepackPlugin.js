'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

var _ModuleFilenameHelpers2 = _interopRequireDefault(_ModuleFilenameHelpers);

var _webpackSources = require('webpack-sources');

var _prepack = require('prepack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultConfiguration = {
  prepack: {},
  test: /\.js($|\?)/i
};

class PrepackPlugin {

  constructor(userConfiguration) {
    this.configuration = _extends({}, defaultConfiguration, userConfiguration);
  }

  apply(compiler) {
    const { configuration } = this;

    compiler.hooks.compilation.tap('PrepackPlugin', compilation => {
      compilation.hooks.optimizeChunkAssets.tap('PrepackPlugin', chunks => {
        chunks.forEach(chunk => {
          // prepack every file in chunk
          chunk.files.forEach(filePath => {
            // check if file extension matches to configuration.test
            if (_ModuleFilenameHelpers2.default.matchObject({
              test: configuration.test
            }, filePath)) {
              // prepack and apply changes
              compilation.assets[filePath] = new _webpackSources.RawSource((0, _prepack.prepackSources)([{
                fileContents: compilation.assets[filePath].source(),
                filePath
              }], _extends({}, configuration.prepack)).code);
            }
          });
        });
      });
    });
  }
}
exports.default = PrepackPlugin;
//# sourceMappingURL=PrepackPlugin.js.map