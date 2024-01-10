"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const htmlnano = require("./lib/htmlnano.cjs").default;
exports.default = htmlnano;

// for backward compatibility with require('htmlnano')
module.exports = htmlnano;
