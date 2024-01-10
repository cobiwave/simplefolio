'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var analytics = require('@firebase/analytics');



Object.keys(analytics).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return analytics[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
