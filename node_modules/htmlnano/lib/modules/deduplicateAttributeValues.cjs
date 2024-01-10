"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onAttrs = onAttrs;
var _collapseAttributeWhitespace = require("./collapseAttributeWhitespace.cjs");
/** Deduplicate values inside list-like attributes (e.g. class, rel) */
function onAttrs() {
  return attrs => {
    const newAttrs = attrs;
    Object.keys(attrs).forEach(attrName => {
      if (!_collapseAttributeWhitespace.attributesWithLists.has(attrName)) {
        return;
      }
      if (typeof attrs[attrName] !== 'string') {
        return;
      }
      const attrValues = attrs[attrName].split(/\s/);
      const uniqeAttrValues = new Set();
      const deduplicatedAttrValues = [];
      attrValues.forEach(attrValue => {
        if (!attrValue) {
          // Keep whitespaces
          deduplicatedAttrValues.push('');
          return;
        }
        if (uniqeAttrValues.has(attrValue)) {
          return;
        }
        deduplicatedAttrValues.push(attrValue);
        uniqeAttrValues.add(attrValue);
      });
      newAttrs[attrName] = deduplicatedAttrValues.join(' ');
    });
    return newAttrs;
  };
}