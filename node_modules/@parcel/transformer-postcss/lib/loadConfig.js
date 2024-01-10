"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
    return data;
  };
  return data;
}
function _diagnostic() {
  const data = require("@parcel/diagnostic");
  _diagnostic = function () {
    return data;
  };
  return data;
}
function _nullthrows() {
  const data = _interopRequireDefault(require("nullthrows"));
  _nullthrows = function () {
    return data;
  };
  return data;
}
function _clone() {
  const data = _interopRequireDefault(require("clone"));
  _clone = function () {
    return data;
  };
  return data;
}
var _constants = require("./constants");
var _loadPlugins = _interopRequireDefault(require("./loadPlugins"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function configHydrator(configFile, config, resolveFrom, options, logger) {
  if (configFile == null) {
    return;
  }

  // Load the custom config...
  let modulesConfig;
  let configFilePlugins = (0, _clone().default)(configFile.plugins);
  if (configFilePlugins != null && typeof configFilePlugins === 'object' && configFilePlugins['postcss-modules'] != null) {
    modulesConfig = configFilePlugins['postcss-modules'];
    delete configFilePlugins['postcss-modules'];
  }
  if (!modulesConfig && configFile.modules) {
    modulesConfig = {};
  }
  let plugins = await (0, _loadPlugins.default)(configFilePlugins, (0, _nullthrows().default)(resolveFrom), options);

  // contents is either:
  // from JSON:    { plugins: { 'postcss-foo': { ...opts } } }
  // from JS (v8): { plugins: [ { postcssPlugin: 'postcss-foo', ...visitor callback functions } ]
  // from JS (v7): { plugins: [ [Function: ...] ]
  let pluginArray = Array.isArray(configFilePlugins) ? configFilePlugins : Object.keys(configFilePlugins);
  for (let p of pluginArray) {
    if (typeof p === 'string') {
      config.addDevDependency({
        specifier: p,
        resolveFrom: (0, _nullthrows().default)(resolveFrom)
      });
    }
  }
  let redundantPlugins = pluginArray.filter(p => p === 'autoprefixer' || p === 'postcss-preset-env');
  if (redundantPlugins.length > 0) {
    let filename = _path().default.basename(resolveFrom);
    let isPackageJson = filename === 'package.json';
    let message;
    let hints = [];
    if (!isPackageJson && redundantPlugins.length === pluginArray.length) {
      message = (0, _diagnostic().md)`Parcel includes CSS transpilation and vendor prefixing by default. PostCSS config __${filename}__ contains only redundant plugins. Deleting it may significantly improve build performance.`;
      hints.push((0, _diagnostic().md)`Delete __${filename}__`);
    } else {
      message = (0, _diagnostic().md)`Parcel includes CSS transpilation and vendor prefixing by default. PostCSS config __${filename}__ contains the following redundant plugins: ${[...redundantPlugins].map(p => _diagnostic().md.underline(p))}. Removing these may improve build performance.`;
      hints.push((0, _diagnostic().md)`Remove the above plugins from __${filename}__`);
    }
    let codeFrames;
    if (_path().default.extname(filename) !== '.js') {
      let contents = await options.inputFS.readFile(resolveFrom, 'utf8');
      let prefix = isPackageJson ? '/postcss' : '';
      codeFrames = [{
        language: 'json',
        filePath: resolveFrom,
        code: contents,
        codeHighlights: (0, _diagnostic().generateJSONCodeHighlights)(contents, redundantPlugins.map(plugin => ({
          key: `${prefix}/plugins/${plugin}`,
          type: 'key'
        })))
      }];
    } else {
      codeFrames = [{
        filePath: resolveFrom,
        codeHighlights: [{
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 1
          }
        }]
      }];
    }
    logger.warn({
      message,
      hints,
      documentationURL: 'https://parceljs.org/languages/css/#default-plugins',
      codeFrames
    });
  }
  return {
    raw: configFile,
    filePath: resolveFrom,
    hydrated: {
      plugins,
      from: config.searchPath,
      to: config.searchPath,
      modules: modulesConfig
    }
  };
}
async function load({
  config,
  options,
  logger
}) {
  if (!config.isSource) {
    return;
  }
  let configFile = await config.getConfig(['.postcssrc', '.postcssrc.json', '.postcssrc.js', '.postcssrc.cjs', '.postcssrc.mjs', 'postcss.config.js', 'postcss.config.cjs', 'postcss.config.mjs'], {
    packageKey: 'postcss'
  });
  let contents = null;
  if (configFile) {
    config.addDevDependency({
      specifier: 'postcss',
      resolveFrom: config.searchPath,
      range: _constants.POSTCSS_RANGE
    });
    contents = configFile.contents;
    let isDynamic = configFile && _path().default.extname(configFile.filePath).endsWith('js');
    if (isDynamic) {
      // We have to invalidate on startup in case the config is non-deterministic,
      // e.g. using unknown environment variables, reading from the filesystem, etc.
      logger.warn({
        message: 'WARNING: Using a JavaScript PostCSS config file means losing out on caching features of Parcel. Use a .postcssrc(.json) file whenever possible.'
      });
    }
    if (typeof contents !== 'object') {
      throw new Error('PostCSS config should be an object.');
    }
    if (contents.plugins == null || typeof contents.plugins !== 'object' || Object.keys(contents.plugins).length === 0) {
      throw new Error('PostCSS config must have plugins');
    }
  }
  return configHydrator(contents, config, configFile === null || configFile === void 0 ? void 0 : configFile.filePath, options, logger);
}