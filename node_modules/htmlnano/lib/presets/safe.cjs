"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * Minify HTML in a safe way without breaking anything.
 */
var _default = exports.default = {
  /* ----------------------------------------
   * Attributes
   * ---------------------------------------- */
  // normalize the case of attribute names and values
  // normalizeAttributeValues will also normalize property value with invalid value default
  // See https://html.spec.whatwg.org/#invalid-value-default
  normalizeAttributeValues: true,
  removeEmptyAttributes: true,
  collapseAttributeWhitespace: true,
  // removeRedundantAttributes will remove attributes when missing value default matches the attribute's value
  // See https://html.spec.whatwg.org/#missing-value-default
  removeRedundantAttributes: false,
  // collapseBooleanAttributes will also collapse those default state can be omitted
  collapseBooleanAttributes: {
    amphtml: false
  },
  deduplicateAttributeValues: true,
  minifyUrls: false,
  sortAttributes: false,
  sortAttributesWithLists: 'alphabetical',
  /* ----------------------------------------
   * Minify HTML content
   * ---------------------------------------- */
  collapseWhitespace: 'conservative',
  removeComments: 'safe',
  minifyConditionalComments: false,
  removeOptionalTags: false,
  removeAttributeQuotes: false,
  /* ----------------------------------------
   * Minify inline <style>, <script> and <svg> tag
   * ---------------------------------------- */
  mergeStyles: false,
  mergeScripts: false,
  minifyCss: {
    preset: 'default'
  },
  minifyJs: {},
  minifyJson: {},
  minifySvg: {
    plugins: [{
      name: 'preset-default',
      params: {
        overrides: {
          collapseGroups: false,
          convertShapeToPath: false
        }
      }
    }]
  },
  removeUnusedCss: false,
  /* ----------------------------------------
   * Miscellaneous
   * ---------------------------------------- */
  custom: []
};