# Contribute

Since the minifier is modular, it's very easy to add new modules:

1. Create a ES6-file inside `lib/modules/` with a function that does some minification. For example you can check [`lib/modules/example.mjs`](https://github.com/posthtml/htmlnano/blob/master/lib/modules/example.mjs).

2. Add the module's name into one of those [presets](https://github.com/posthtml/htmlnano/tree/master/lib/presets). You can choose either `ampSafe`, `max`, or `safe`.

3. Create a JS-file inside `test/modules/` with some unit-tests.

4. Describe your module in the section "[Modules](https://github.com/posthtml/htmlnano/blob/master/README.md#modules)".

5. Send me a pull request.

Other types of contribution (bug fixes, documentation improves, etc) are also welcome!
Would like to contribute, but don't have any ideas what to do? Check out [our issues](https://github.com/posthtml/htmlnano/labels/help%20wanted).
