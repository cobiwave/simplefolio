'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var storage = require('@firebase/storage');



Object.keys(storage).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return storage[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
