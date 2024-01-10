"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WRITE_LIMIT_CHUNK = void 0;
// Node has a file size limit of 2 GB
const WRITE_LIMIT_CHUNK = exports.WRITE_LIMIT_CHUNK = 2 * 1024 ** 3;