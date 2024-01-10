"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = minifyJs;
var _helpers = require("../helpers.cjs");
var _removeRedundantAttributes = require("./removeRedundantAttributes.cjs");
/** Minify JS with Terser */
async function minifyJs(tree, options, terserOptions) {
  const terser = await (0, _helpers.optionalImport)('terser');
  if (!terser) return tree;
  let promises = [];
  tree.walk(node => {
    const nodeAttrs = node.attrs || {};

    /**
     * Skip SRI
     *
     * If the input <script /> has an SRI attribute, it means that the original <script /> could be trusted,
     * and should not be altered anymore.
     *
     * htmlnano is exactly an MITM that SRI is designed to protect from. If htmlnano or its dependencies get
     * compromised and introduces malicious code, then it is up to the original SRI to protect the end user.
     *
     * So htmlnano will simply skip <script /> that has SRI.
     * If developers do trust htmlnano, they should generate SRI after htmlnano modify the <script />.
     */
    if ('integrity' in nodeAttrs) {
      return node;
    }
    if (node.tag && node.tag === 'script') {
      const mimeType = nodeAttrs.type || 'text/javascript';
      if (_removeRedundantAttributes.redundantScriptTypes.has(mimeType) || mimeType === 'module') {
        promises.push(processScriptNode(node, terserOptions, terser));
      }
    }
    if (node.attrs) {
      promises = promises.concat(processNodeWithOnAttrs(node, terserOptions, terser));
    }
    return node;
  });
  return Promise.all(promises).then(() => tree);
}
function stripCdata(js) {
  const leftStrippedJs = js.replace(/\/\/\s*<!\[CDATA\[/, '').replace(/\/\*\s*<!\[CDATA\[\s*\*\//, '');
  if (leftStrippedJs === js) {
    return js;
  }
  const strippedJs = leftStrippedJs.replace(/\/\/\s*\]\]>/, '').replace(/\/\*\s*\]\]>\s*\*\//, '');
  return leftStrippedJs === strippedJs ? js : strippedJs;
}
function processScriptNode(scriptNode, terserOptions, terser) {
  let js = (scriptNode.content || []).join('').trim();
  if (!js) {
    return scriptNode;
  }

  // Improve performance by avoiding calling stripCdata again and again
  let isCdataWrapped = false;
  if (js.includes('CDATA')) {
    const strippedJs = stripCdata(js);
    isCdataWrapped = js !== strippedJs;
    js = strippedJs;
  }
  return terser.minify(js, terserOptions).then(result => {
    if (result.error) {
      throw new Error(result.error);
    }
    if (result.code === undefined) {
      return;
    }
    let content = result.code;
    if (isCdataWrapped) {
      content = '/*<![CDATA[*/' + content + '/*]]>*/';
    }
    scriptNode.content = [content];
  });
}
function processNodeWithOnAttrs(node, terserOptions, terser) {
  const jsWrapperStart = 'a=function(){';
  const jsWrapperEnd = '};a();';
  const promises = [];
  for (const attrName of Object.keys(node.attrs || {})) {
    if (!(0, _helpers.isEventHandler)(attrName)) {
      continue;
    }

    // For example onclick="return false" is valid,
    // but "return false;" is invalid (error: 'return' outside of function)
    // Therefore the attribute's code should be wrapped inside function:
    // "function _(){return false;}"
    let wrappedJs = jsWrapperStart + node.attrs[attrName] + jsWrapperEnd;
    let promise = terser.minify(wrappedJs, terserOptions).then(({
      code
    }) => {
      let minifiedJs = code.substring(jsWrapperStart.length, code.length - jsWrapperEnd.length);
      node.attrs[attrName] = minifiedJs;
    });
    promises.push(promise);
  }
  return promises;
}