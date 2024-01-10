'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cordova = require('@firebase/auth/cordova');



Object.keys(cordova).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return cordova[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
