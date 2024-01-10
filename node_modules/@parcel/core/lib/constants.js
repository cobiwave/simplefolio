"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALID = exports.STARTUP = exports.PARCEL_VERSION = exports.OPTION_CHANGE = exports.INITIAL_BUILD = exports.HASH_REF_REGEX = exports.HASH_REF_PREFIX = exports.HASH_REF_HASH_LEN = exports.FILE_UPDATE = exports.FILE_DELETE = exports.FILE_CREATE = exports.ERROR = exports.ENV_CHANGE = void 0;
var _package = require("../package.json");
// $FlowFixMe
const PARCEL_VERSION = exports.PARCEL_VERSION = _package.version;
const HASH_REF_PREFIX = exports.HASH_REF_PREFIX = 'HASH_REF_';
const HASH_REF_HASH_LEN = exports.HASH_REF_HASH_LEN = 16;
const HASH_REF_REGEX = exports.HASH_REF_REGEX = new RegExp(`${HASH_REF_PREFIX}\\w{${HASH_REF_HASH_LEN}}`, 'g');
const VALID = exports.VALID = 0;
const INITIAL_BUILD = exports.INITIAL_BUILD = 1 << 0;
const FILE_CREATE = exports.FILE_CREATE = 1 << 1;
const FILE_UPDATE = exports.FILE_UPDATE = 1 << 2;
const FILE_DELETE = exports.FILE_DELETE = 1 << 3;
const ENV_CHANGE = exports.ENV_CHANGE = 1 << 4;
const OPTION_CHANGE = exports.OPTION_CHANGE = 1 << 5;
const STARTUP = exports.STARTUP = 1 << 6;
const ERROR = exports.ERROR = 1 << 7;