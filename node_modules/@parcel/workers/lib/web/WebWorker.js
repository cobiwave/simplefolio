"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _core() {
  const data = require("@parcel/core");
  _core = function () {
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
let id = 0;
class WebWorker {
  constructor(execArgv, onMessage, onError, onExit) {
    this.execArgv = execArgv;
    this.onMessage = onMessage;
    this.onError = onError;
    this.onExit = onExit;
  }
  start() {
    // $FlowFixMe[incompatible-call]
    this.worker = new Worker(new URL('./WebChild.js', import.meta.url), {
      name: `Parcel Worker ${id++}`,
      type: 'module'
    });
    let {
      deferred,
      promise
    } = (0, _utils().makeDeferredWithPromise)();
    this.worker.onmessage = ({
      data
    }) => {
      if (data === 'online') {
        deferred.resolve();
        return;
      }

      // $FlowFixMe assume WorkerMessage as data
      this.handleMessage(data);
    };
    this.worker.onerror = this.onError;
    // Web workers can't crash or intentionally stop on their own, apart from stop() below
    // this.worker.on('exit', this.onExit);

    return promise;
  }
  stop() {
    if (!this.stopping) {
      this.stopping = (async () => {
        this.worker.postMessage('stop');
        let {
          deferred,
          promise
        } = (0, _utils().makeDeferredWithPromise)();
        this.worker.addEventListener('message', ({
          data
        }) => {
          if (data === 'stopped') {
            deferred.resolve();
          }
        });
        await promise;
        this.worker.terminate();
        this.onExit(0);
      })();
    }
    return this.stopping;
  }
  handleMessage(data) {
    this.onMessage((0, _core().restoreDeserializedObject)(data));
  }
  send(data) {
    this.worker.postMessage((0, _core().prepareForSerialization)(data));
  }
}
exports.default = WebWorker;