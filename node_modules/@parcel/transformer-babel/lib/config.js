"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;
function _json() {
  const data = _interopRequireDefault(require("json5"));
  _json = function () {
    return data;
  };
  return data;
}
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
    return data;
  };
  return data;
}
function _utils() {
  const data = require("@parcel/utils");
  _utils = function () {
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
var _constants = require("./constants");
var _jsx = _interopRequireDefault(require("./jsx"));
var _flow = _interopRequireDefault(require("./flow"));
var _utils2 = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TYPESCRIPT_EXTNAME_RE = /\.tsx?$/;
const JS_EXTNAME_RE = /^\.(js|cjs|mjs)$/;
const BABEL_CONFIG_FILENAMES = ['.babelrc', '.babelrc.js', '.babelrc.json', '.babelrc.cjs', '.babelrc.mjs', '.babelignore', 'babel.config.js', 'babel.config.json', 'babel.config.mjs', 'babel.config.cjs'];
async function load(config, options, logger) {
  var _ref, _ref2, _options$env$BABEL_EN;
  // Don't transpile inside node_modules
  if (!config.isSource) {
    return;
  }

  // Invalidate when any babel config file is added.
  for (let fileName of BABEL_CONFIG_FILENAMES) {
    config.invalidateOnFileCreate({
      fileName,
      aboveFilePath: config.searchPath
    });
  }

  // Do nothing if we cannot resolve any babel config filenames. Checking using our own
  // config resolution (which is cached) is much faster than relying on babel.
  if (!(await (0, _utils().resolveConfig)(options.inputFS, config.searchPath, BABEL_CONFIG_FILENAMES, options.projectRoot))) {
    return buildDefaultBabelConfig(options, config);
  }
  const babelCore = await options.packageManager.require('@babel/core', config.searchPath, {
    range: _constants.BABEL_CORE_RANGE,
    saveDev: true,
    shouldAutoInstall: options.shouldAutoInstall
  });
  config.addDevDependency({
    specifier: '@babel/core',
    resolveFrom: config.searchPath,
    range: _constants.BABEL_CORE_RANGE
  });
  config.invalidateOnEnvChange('BABEL_ENV');
  config.invalidateOnEnvChange('NODE_ENV');
  let babelOptions = {
    filename: config.searchPath,
    cwd: options.projectRoot,
    envName: (_ref = (_ref2 = (_options$env$BABEL_EN = options.env.BABEL_ENV) !== null && _options$env$BABEL_EN !== void 0 ? _options$env$BABEL_EN : options.env.NODE_ENV) !== null && _ref2 !== void 0 ? _ref2 : options.mode === 'production' || options.mode === 'development' ? options.mode : null) !== null && _ref !== void 0 ? _ref : 'development',
    showIgnoredFiles: true
  };
  let partialConfig = await babelCore.loadPartialConfigAsync(babelOptions);
  let addIncludedFile = file => {
    if (JS_EXTNAME_RE.test(_path().default.extname(file))) {
      // We need to invalidate on startup in case the config is non-static,
      // e.g. uses unknown environment variables, reads from the filesystem, etc.
      logger.warn({
        message: `It looks like you're using a JavaScript Babel config file. This means the config cannot be watched for changes, and Babel transformations cannot be cached. You'll need to restart Parcel for changes to this config to take effect. Try using a ${_path().default.basename(file, _path().default.extname(file)) + '.json'} file instead.`
      });
      config.invalidateOnStartup();

      // But also add the config as a dev dependency so we can at least attempt invalidation in watch mode.
      config.addDevDependency({
        specifier: (0, _utils().relativePath)(options.projectRoot, file),
        resolveFrom: _path().default.join(options.projectRoot, 'index'),
        // Also invalidate @babel/core when the config or a dependency updates.
        // This ensures that the caches in @babel/core are also invalidated.
        additionalInvalidations: [{
          specifier: '@babel/core',
          resolveFrom: config.searchPath,
          range: _constants.BABEL_CORE_RANGE
        }]
      });
    } else {
      config.invalidateOnFileChange(file);
    }
  };
  let warnOldVersion = () => {
    logger.warn({
      message: 'You are using an old version of @babel/core which does not support the necessary features for Parcel to cache and watch babel config files safely. You may need to restart Parcel for config changes to take effect. Please upgrade to @babel/core 7.12.0 or later to resolve this issue.'
    });
    config.invalidateOnStartup();
  };

  // Old versions of @babel/core return null from loadPartialConfig when the file should explicitly not be run through babel (ignore/exclude)
  if (partialConfig == null) {
    warnOldVersion();
    return;
  }
  if (partialConfig.files == null) {
    // If the files property is missing, we're on an old version of @babel/core.
    // We need to invalidate on startup because we can't properly track dependencies.
    if (partialConfig.hasFilesystemConfig()) {
      warnOldVersion();
      if (typeof partialConfig.babelrcPath === 'string') {
        addIncludedFile(partialConfig.babelrcPath);
      }
      if (typeof partialConfig.configPath === 'string') {
        addIncludedFile(partialConfig.configPath);
      }
    }
  } else {
    for (let file of partialConfig.files) {
      addIncludedFile(file);
    }
  }
  if (partialConfig.fileHandling != null && partialConfig.fileHandling !== 'transpile') {} else if (partialConfig.hasFilesystemConfig()) {
    // Determine what syntax plugins we need to enable
    let syntaxPlugins = [];
    if (TYPESCRIPT_EXTNAME_RE.test(config.searchPath)) {
      syntaxPlugins.push('typescript');
      if (config.searchPath.endsWith('.tsx')) {
        syntaxPlugins.push('jsx');
      }
    } else if (await (0, _jsx.default)(options, config)) {
      syntaxPlugins.push('jsx');
    }

    // If the config has plugins loaded with require(), or inline plugins in the config,
    // we can't cache the result of the compilation because we don't know where they came from.
    if (hasRequire(partialConfig.options)) {
      logger.warn({
        message: 'It looks like you are using `require` to configure Babel plugins or presets. This means Babel transformations cannot be cached and will run on each build. Please use strings to configure Babel instead.'
      });
      config.setCacheKey(JSON.stringify(Date.now()));
      config.invalidateOnStartup();
    } else {
      await warnOnRedundantPlugins(options.inputFS, partialConfig, logger);
      definePluginDependencies(config, partialConfig.options, options);
      config.setCacheKey((0, _utils().hashObject)(partialConfig.options));
    }
    return {
      internal: false,
      config: partialConfig.options,
      targets: (0, _utils2.enginesToBabelTargets)(config.env),
      syntaxPlugins
    };
  } else {
    return buildDefaultBabelConfig(options, config);
  }
}
async function buildDefaultBabelConfig(options, config) {
  // If this is a .ts or .tsx file, we don't need to enable flow.
  if (TYPESCRIPT_EXTNAME_RE.test(config.searchPath)) {
    return;
  }

  // Detect flow. If not enabled, babel doesn't need to run at all.
  let babelOptions = await (0, _flow.default)(config, options);
  if (babelOptions == null) {
    return;
  }

  // When flow is enabled, we may also need to enable JSX so it parses properly.
  let syntaxPlugins = [];
  if (await (0, _jsx.default)(options, config)) {
    syntaxPlugins.push('jsx');
  }
  definePluginDependencies(config, babelOptions, options);
  return {
    internal: true,
    config: babelOptions,
    syntaxPlugins
  };
}
function hasRequire(options) {
  let configItems = [...options.presets, ...options.plugins];
  return configItems.some(item => !item.file);
}
function definePluginDependencies(config, babelConfig, options) {
  if (babelConfig == null) {
    return;
  }
  let configItems = [...(babelConfig.presets || []), ...(babelConfig.plugins || [])];
  for (let configItem of configItems) {
    // FIXME: this uses a relative path from the project root rather than resolving
    // from the config location because configItem.file.request can be a shorthand
    // rather than a full package name.
    config.addDevDependency({
      specifier: (0, _utils().relativePath)(options.projectRoot, configItem.file.resolved),
      resolveFrom: _path().default.join(options.projectRoot, 'index'),
      // Also invalidate @babel/core when the plugin or a dependency updates.
      // This ensures that the caches in @babel/core are also invalidated.
      additionalInvalidations: [{
        specifier: '@babel/core',
        resolveFrom: config.searchPath,
        range: _constants.BABEL_CORE_RANGE
      }]
    });
  }
}
const redundantPresets = new Set(['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript', '@parcel/babel-preset-env']);
async function warnOnRedundantPlugins(fs, babelConfig, logger) {
  var _babelConfig$config;
  if (babelConfig == null) {
    return;
  }
  let configPath = (_babelConfig$config = babelConfig.config) !== null && _babelConfig$config !== void 0 ? _babelConfig$config : babelConfig.babelrc;
  if (!configPath) {
    return;
  }
  let presets = babelConfig.options.presets || [];
  let plugins = babelConfig.options.plugins || [];
  let foundRedundantPresets = new Set();
  let filteredPresets = presets.filter(preset => {
    if (redundantPresets.has(preset.file.request)) {
      foundRedundantPresets.add(preset.file.request);
      return false;
    }
    return true;
  });
  let filePath = _path().default.relative(process.cwd(), configPath);
  let diagnostics = [];
  if (filteredPresets.length === 0 && foundRedundantPresets.size > 0 && plugins.length === 0) {
    diagnostics.push({
      message: (0, _diagnostic().md)`Parcel includes transpilation by default. Babel config __${filePath}__ contains only redundant presets. Deleting it may significantly improve build performance.`,
      codeFrames: [{
        filePath: configPath,
        codeHighlights: await getCodeHighlights(fs, configPath, foundRedundantPresets)
      }],
      hints: [(0, _diagnostic().md)`Delete __${filePath}__`],
      documentationURL: 'https://parceljs.org/languages/javascript/#default-presets'
    });
  } else if (foundRedundantPresets.size > 0) {
    diagnostics.push({
      message: (0, _diagnostic().md)`Parcel includes transpilation by default. Babel config __${filePath}__ includes the following redundant presets: ${[...foundRedundantPresets].map(p => _diagnostic().md.underline(p))}. Removing these may improve build performance.`,
      codeFrames: [{
        filePath: configPath,
        codeHighlights: await getCodeHighlights(fs, configPath, foundRedundantPresets)
      }],
      hints: [(0, _diagnostic().md)`Remove the above presets from __${filePath}__`],
      documentationURL: 'https://parceljs.org/languages/javascript/#default-presets'
    });
  }
  if (foundRedundantPresets.has('@babel/preset-env')) {
    var _babelConfig$config2, _babelConfig$config3;
    diagnostics.push({
      message: "@babel/preset-env does not support Parcel's targets, which will likely result in unnecessary transpilation and larger bundle sizes.",
      codeFrames: [{
        filePath: (_babelConfig$config2 = babelConfig.config) !== null && _babelConfig$config2 !== void 0 ? _babelConfig$config2 : babelConfig.babelrc,
        codeHighlights: await getCodeHighlights(fs, (_babelConfig$config3 = babelConfig.config) !== null && _babelConfig$config3 !== void 0 ? _babelConfig$config3 : babelConfig.babelrc, new Set(['@babel/preset-env']))
      }],
      hints: [`Either remove __@babel/preset-env__ to use Parcel's builtin transpilation, or replace with __@parcel/babel-preset-env__`],
      documentationURL: 'https://parceljs.org/languages/javascript/#custom-plugins'
    });
  }
  if (diagnostics.length > 0) {
    logger.warn(diagnostics);
  }
}
async function getCodeHighlights(fs, filePath, redundantPresets) {
  let ext = _path().default.extname(filePath);
  if (ext !== '.js' && ext !== '.cjs' && ext !== '.mjs') {
    let contents = await fs.readFile(filePath, 'utf8');
    let json = _json().default.parse(contents);
    let presets = json.presets || [];
    let pointers = [];
    for (let i = 0; i < presets.length; i++) {
      if (Array.isArray(presets[i]) && redundantPresets.has(presets[i][0])) {
        pointers.push({
          type: 'value',
          key: `/presets/${i}/0`
        });
      } else if (redundantPresets.has(presets[i])) {
        pointers.push({
          type: 'value',
          key: `/presets/${i}`
        });
      }
    }
    if (pointers.length > 0) {
      return (0, _diagnostic().generateJSONCodeHighlights)(contents, pointers);
    }
  }
  return [{
    start: {
      line: 1,
      column: 1
    },
    end: {
      line: 1,
      column: 1
    }
  }];
}