# Presets

A preset is just an object with modules config.

Currently the following presets are available:
- [safe](https://github.com/posthtml/htmlnano/blob/master/lib/presets/safe.mjs) — a default preset for minifying a regular HTML in a safe way (without breaking anything)
- [ampSafe](https://github.com/posthtml/htmlnano/blob/master/lib/presets/ampSafe.mjs) - same as `safe` preset but for [AMP pages](https://www.ampproject.org/)
- [max](https://github.com/posthtml/htmlnano/blob/master/lib/presets/max.mjs) - maximal minification (might break some pages)


You can use them the following way:
```js
const htmlnano = require('htmlnano');
const ampSafePreset = require('htmlnano').presets.ampSafe;
const options = {
    // Your options
};

htmlnano
    .process(html, options, ampSafePreset)
    .then(function (result) {
        // result.html is minified
    })
    .catch(function (err) {
        console.error(err);
    });
```

If you skip `preset` argument [`safe`](https://github.com/posthtml/htmlnano/blob/master/lib/presets/safe.mjs) preset would be used by default.


If you'd like to define your very own config without any presets pass an empty object as a preset:
```js
const htmlnano = require('htmlnano');
const options = {
    // Your options
};

htmlnano
    .process(html, options, {})
    .then(function (result) {
        // result.html is minified
    })
    .catch(function (err) {
        console.error(err);
    });
```


You might create also your own presets:
```js
const htmlnano = require('htmlnano');
// Preset for minifying email templates
const emailPreset = {
    mergeStyles: true,
    minifyCss: {
        safe: true
    },
};

const options = {
    // Some specific options
};

htmlnano
    .process(html, options, emailPreset)
    .then(function (result) {
        // result.html is minified
    })
    .catch(function (err) {
        console.error(err);
    });
```

Feel free [to submit a PR](https://github.com/posthtml/htmlnano/issues/new) with your preset if it might be useful for other developers as well.
