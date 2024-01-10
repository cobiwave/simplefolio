"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _plugin() {
  const data = require("@parcel/plugin");
  _plugin = function () {
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
var _default = exports.default = new (_plugin().Runtime)({
  apply({
    bundle,
    bundleGraph
  }) {
    if (bundle.env.context !== 'service-worker') {
      return [];
    }
    let asset = bundle.traverse((node, _, actions) => {
      if (node.type === 'dependency' && node.value.specifier === '@parcel/service-worker' && !bundleGraph.isDependencySkipped(node.value)) {
        actions.stop();
        return bundleGraph.getResolvedAsset(node.value, bundle);
      }
    });
    if (!asset) {
      return [];
    }
    let manifest = [];
    bundleGraph.traverseBundles(b => {
      if (b.bundleBehavior === 'inline' || b.id === bundle.id) {
        return;
      }
      manifest.push((0, _utils().urlJoin)(b.target.publicUrl, b.name));
    });
    let code = `import {_register} from '@parcel/service-worker';
const manifest = ${JSON.stringify(manifest)};
const version = ${JSON.stringify(bundle.hashReference)};
_register(manifest, version);
`;
    return [{
      filePath: asset.filePath,
      code,
      isEntry: true,
      env: {
        sourceType: 'module'
      }
    }];
  }
});