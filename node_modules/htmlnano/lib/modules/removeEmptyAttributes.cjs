"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onAttrs = onAttrs;
var _helpers = require("../helpers.cjs");
const safeToRemoveAttrs = {
  id: null,
  class: null,
  style: null,
  title: null,
  lang: null,
  dir: null,
  abbr: ['th'],
  accept: ['input'],
  'accept-charset': ['form'],
  charset: ['meta', 'script'],
  action: ['form'],
  cols: ['textarea'],
  colspan: ['td', 'th'],
  coords: ['area'],
  dirname: ['input', 'textarea'],
  dropzone: null,
  headers: ['td', 'th'],
  form: ['button', 'fieldset', 'input', 'keygen', 'object', 'output', 'select', 'textarea'],
  formaction: ['button', 'input'],
  height: ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video'],
  high: 'meter',
  href: 'link',
  list: 'input',
  low: 'meter',
  manifest: 'html',
  max: ['meter', 'progress'],
  maxLength: ['input', 'textarea'],
  menu: 'button',
  min: 'meter',
  minLength: ['input', 'textarea'],
  name: ['button', 'fieldset', 'input', 'keygen', 'output', 'select', 'textarea', 'form', 'map', 'meta', 'param', 'slot'],
  pattern: ['input'],
  ping: ['a', 'area'],
  placeholder: ['input', 'textarea'],
  poster: ['video'],
  rel: ['a', 'area', 'link'],
  rows: 'textarea',
  rowspan: ['td', 'th'],
  size: ['input', 'select'],
  span: ['col', 'colgroup'],
  src: ['audio', 'embed', 'iframe', 'img', 'input', 'script', 'source', 'track', 'video'],
  start: 'ol',
  tabindex: null,
  type: ['a', 'link', 'button', 'embed', 'object', 'script', 'source', 'style', 'input', 'menu', 'menuitem', 'ol'],
  value: ['button', 'input', 'li'],
  width: ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video']
};
function onAttrs() {
  return (attrs, node) => {
    const newAttrs = {
      ...attrs
    };
    Object.entries(attrs).forEach(([attrName, attrValue]) => {
      if ((0, _helpers.isEventHandler)(attrName) || Object.hasOwnProperty.call(safeToRemoveAttrs, attrName) && (safeToRemoveAttrs[attrName] === null || safeToRemoveAttrs[attrName].includes(node.tag))) {
        if (typeof attrValue === 'string') {
          if (attrValue === '' || attrValue.trim() === '') {
            delete newAttrs[attrName];
          }
        }
      }
    });
    return newAttrs;
  };
}