'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var auth = require('@firebase/auth');



Object.keys(auth).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return auth[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
