"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PACKAGE_DESCRIPTOR_SCHEMA = exports.ENGINES_SCHEMA = exports.DESCRIPTOR_SCHEMA = exports.COMMON_TARGET_DESCRIPTOR_SCHEMA = void 0;
const ENGINES_SCHEMA = exports.ENGINES_SCHEMA = {
  type: 'object',
  properties: {
    browsers: {
      oneOf: [{
        type: 'array',
        items: {
          type: 'string'
        }
      }, {
        type: 'string'
      }]
    }
  },
  __forbiddenProperties: ['browser'],
  additionalProperties: {
    type: 'string'
  }
};
const PACKAGE_DESCRIPTOR_SCHEMA = exports.PACKAGE_DESCRIPTOR_SCHEMA = {
  type: 'object',
  properties: {
    context: {
      type: 'string',
      enum: ['node', 'browser', 'web-worker', 'electron-main', 'electron-renderer', 'service-worker']
    },
    includeNodeModules: {
      oneOf: [{
        type: 'boolean'
      }, {
        type: 'array',
        items: {
          type: 'string',
          __type: 'a wildcard or filepath'
        }
      }, {
        type: 'object',
        properties: {},
        additionalProperties: {
          type: 'boolean'
        }
      }]
    },
    outputFormat: {
      type: 'string',
      enum: ['global', 'esmodule', 'commonjs']
    },
    distDir: {
      type: 'string'
    },
    publicUrl: {
      type: 'string'
    },
    isLibrary: {
      type: 'boolean'
    },
    source: {
      oneOf: [{
        type: 'string'
      }, {
        type: 'array',
        items: {
          type: 'string'
        }
      }]
    },
    sourceMap: {
      oneOf: [{
        type: 'boolean'
      }, {
        type: 'object',
        properties: {
          inlineSources: {
            type: 'boolean'
          },
          sourceRoot: {
            type: 'string'
          },
          inline: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }]
    },
    engines: ENGINES_SCHEMA,
    optimize: {
      type: 'boolean'
    },
    scopeHoist: {
      type: 'boolean'
    }
  },
  additionalProperties: false
};
const DESCRIPTOR_SCHEMA = exports.DESCRIPTOR_SCHEMA = {
  ...PACKAGE_DESCRIPTOR_SCHEMA,
  properties: {
    ...PACKAGE_DESCRIPTOR_SCHEMA.properties,
    distEntry: {
      type: 'string'
    }
  }
};
const COMMON_TARGET_DESCRIPTOR_SCHEMA = exports.COMMON_TARGET_DESCRIPTOR_SCHEMA = {
  oneOf: [PACKAGE_DESCRIPTOR_SCHEMA, {
    enum: [false]
  }]
};