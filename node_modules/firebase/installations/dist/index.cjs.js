'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var installations = require('@firebase/installations');



Object.keys(installations).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return installations[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
