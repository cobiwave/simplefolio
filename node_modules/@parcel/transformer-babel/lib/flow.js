"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFlowOptions;
var _constants = require("./constants");
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Generates a babel config for stripping away Flow types.
 */
async function getFlowOptions(config, options) {
  if (!config.isSource) {
    return null;
  }

  // Only add flow plugin if `flow-bin` is listed as a dependency in the root package.json
  let conf = await config.getConfigFrom(options.projectRoot + '/index', ['package.json']);
  let pkg = conf === null || conf === void 0 ? void 0 : conf.contents;
  if (!pkg || !(pkg.dependencies && pkg.dependencies['flow-bin']) && !(pkg.devDependencies && pkg.devDependencies['flow-bin'])) {
    return null;
  }
  const babelCore = await options.packageManager.require('@babel/core', config.searchPath, {
    range: _constants.BABEL_CORE_RANGE,
    saveDev: true,
    shouldAutoInstall: options.shouldAutoInstall
  });
  await options.packageManager.require('@babel/plugin-transform-flow-strip-types', config.searchPath, {
    range: '^7.0.0',
    saveDev: true,
    shouldAutoInstall: options.shouldAutoInstall
  });
  return {
    plugins: [babelCore.createConfigItem(['@babel/plugin-transform-flow-strip-types', {
      requireDirective: true
    }], {
      type: 'plugin',
      dirname: _path().default.dirname(config.searchPath)
    })]
  };
}