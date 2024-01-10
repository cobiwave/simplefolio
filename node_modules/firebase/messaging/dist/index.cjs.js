'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var messaging = require('@firebase/messaging');



Object.keys(messaging).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return messaging[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
