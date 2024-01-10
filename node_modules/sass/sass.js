#!/usr/bin/env node

var library = require('./sass.dart.js');
library.load({
  readline: require("readline"),
  chokidar: require("chokidar"),
});

library.cli_pkg_main_0_(process.argv.slice(2));
