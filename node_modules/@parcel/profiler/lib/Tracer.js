"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tracer = exports.default = exports.PluginTracer = void 0;
function _events() {
  const data = require("@parcel/events");
  _events = function () {
    return data;
  };
  return data;
}
function _perf_hooks() {
  const data = require("perf_hooks");
  _perf_hooks = function () {
    return data;
  };
  return data;
}
// @ts-ignore
let tid;
try {
  tid = require('worker_threads').threadId;
} catch {
  tid = 0;
}
const pid = process.pid;
class TraceMeasurement {
  #active = true;
  #name;
  #pid;
  #tid;
  #start;
  // $FlowFixMe
  #data;
  constructor(tracer, name, pid, tid, data) {
    this.#name = name;
    this.#pid = pid;
    this.#tid = tid;
    this.#start = _perf_hooks().performance.now();
    this.#data = data;
  }
  end() {
    if (!this.#active) return;
    const duration = _perf_hooks().performance.now() - this.#start;
    tracer.trace({
      type: 'trace',
      name: this.#name,
      pid: this.#pid,
      tid: this.#tid,
      duration,
      ts: this.#start,
      ...this.#data
    });
    this.#active = false;
  }
}
class Tracer {
  #traceEmitter = new (_events().ValueEmitter)();
  #enabled = false;
  onTrace(cb) {
    return this.#traceEmitter.addListener(cb);
  }
  async wrap(name, fn) {
    let measurement = this.createMeasurement(name);
    try {
      await fn();
    } finally {
      measurement && measurement.end();
    }
  }
  createMeasurement(name, category = 'Core', argumentName, otherArgs) {
    if (!this.enabled) return null;

    // We create `args` in a fairly verbose way to avoid object
    // allocation where not required.
    let args;
    if (typeof argumentName === 'string') {
      args = {
        name: argumentName
      };
    }
    if (typeof otherArgs === 'object') {
      if (typeof args == 'undefined') {
        args = {};
      }
      for (const [k, v] of Object.entries(otherArgs)) {
        args[k] = v;
      }
    }
    const data = {
      categories: [category],
      args
    };
    return new TraceMeasurement(this, name, pid, tid, data);
  }
  get enabled() {
    return this.#enabled;
  }
  enable() {
    this.#enabled = true;
  }
  disable() {
    this.#enabled = false;
  }
  trace(event) {
    if (!this.#enabled) return;
    this.#traceEmitter.emit(event);
  }
}
exports.default = Tracer;
const tracer = exports.tracer = new Tracer();
class PluginTracer {
  /** @private */

  /** @private */

  /** @private */
  constructor(opts) {
    this.origin = opts.origin;
    this.category = opts.category;
  }
  get enabled() {
    return tracer.enabled;
  }
  createMeasurement(name, category, argumentName, otherArgs) {
    return tracer.createMeasurement(name, `${this.category}:${this.origin}${typeof category === 'string' ? `:${category}` : ''}`, argumentName, otherArgs);
  }
}
exports.PluginTracer = PluginTracer;