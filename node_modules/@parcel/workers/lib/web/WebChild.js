"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _childState = require("../childState");
var _child = require("../child");
function _core() {
  const data = require("@parcel/core");
  _core = function () {
    return data;
  };
  return data;
}
/* eslint-env worker*/
class WebChild {
  constructor(onMessage, onExit) {
    if (!(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)) {
      throw new Error('Only create WebChild instances in a worker!');
    }
    this.onMessage = onMessage;
    this.onExit = onExit;
    self.addEventListener('message', ({
      data
    }) => {
      if (data === 'stop') {
        this.onExit(0);
        self.postMessage('stopped');
      }
      // $FlowFixMe assume WorkerMessage as data
      this.handleMessage(data);
    });
    self.postMessage('online');
  }
  handleMessage(data) {
    this.onMessage((0, _core().restoreDeserializedObject)(data));
  }
  send(data) {
    self.postMessage((0, _core().prepareForSerialization)(data));
  }
}
exports.default = WebChild;
(0, _childState.setChild)(new _child.Child(WebChild));