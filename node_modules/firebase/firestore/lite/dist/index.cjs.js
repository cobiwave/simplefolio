'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lite = require('@firebase/firestore/lite');



Object.keys(lite).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return lite[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
