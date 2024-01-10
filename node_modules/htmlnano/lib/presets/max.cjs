"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _safe = _interopRequireDefault(require("./safe.cjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Maximal minification (might break some pages)
 */
var _default = exports.default = {
  ..._safe.default,
  collapseWhitespace: 'all',
  removeComments: 'all',
  removeAttributeQuotes: true,
  removeRedundantAttributes: true,
  mergeScripts: true,
  mergeStyles: true,
  removeUnusedCss: {},
  minifyCss: {
    preset: 'default'
  },
  minifySvg: {},
  minifyConditionalComments: true,
  removeOptionalTags: true
};