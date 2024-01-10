"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remapAstLocations = remapAstLocations;
function remapAstLocations(t, ast, map) {
  // remap ast to original mappings
  // This improves sourcemap accuracy and fixes sourcemaps when scope-hoisting
  traverseAll(t, ast.program, node => {
    if (node.loc) {
      var _node$loc;
      if ((_node$loc = node.loc) !== null && _node$loc !== void 0 && _node$loc.start) {
        let mapping = map.findClosestMapping(node.loc.start.line, node.loc.start.column);
        if (mapping !== null && mapping !== void 0 && mapping.original) {
          // $FlowFixMe
          node.loc.start.line = mapping.original.line;
          // $FlowFixMe
          node.loc.start.column = mapping.original.column;

          // $FlowFixMe
          let length = node.loc.end.column - node.loc.start.column;

          // $FlowFixMe
          node.loc.end.line = mapping.original.line;
          // $FlowFixMe
          node.loc.end.column = mapping.original.column + length;

          // $FlowFixMe
          node.loc.filename = mapping.source;
        } else {
          // Maintain null mappings?
          node.loc = null;
        }
      }
    }
  });
}
function traverseAll(t, node, visitor) {
  if (!node) {
    return;
  }
  visitor(node);
  for (let key of t.VISITOR_KEYS[node.type] || []) {
    // $FlowFixMe
    let subNode = node[key];
    if (Array.isArray(subNode)) {
      for (let i = 0; i < subNode.length; i++) {
        traverseAll(t, subNode[i], visitor);
      }
    } else {
      traverseAll(t, subNode, visitor);
    }
  }
}