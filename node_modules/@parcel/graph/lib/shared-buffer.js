"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedBuffer = void 0;
// Copy from @parcel/utils to fix: https://github.com/stackblitz/core/issues/1855
let SharedBuffer = exports.SharedBuffer = void 0;

// $FlowFixMe[prop-missing]
if (process.browser) {
  exports.SharedBuffer = SharedBuffer = ArrayBuffer;
  // Safari has removed the constructor
  if (typeof SharedArrayBuffer !== 'undefined') {
    let channel = new MessageChannel();
    try {
      // Firefox might throw when sending the Buffer over a MessagePort
      channel.port1.postMessage(new SharedArrayBuffer(0));
      exports.SharedBuffer = SharedBuffer = SharedArrayBuffer;
    } catch (_) {
      // NOOP
    }
    channel.port1.close();
    channel.port2.close();
  }
} else {
  exports.SharedBuffer = SharedBuffer = SharedArrayBuffer;
}