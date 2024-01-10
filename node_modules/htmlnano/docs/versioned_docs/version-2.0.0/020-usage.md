# Usage

## Gulp
```bash
npm install --save-dev gulp-htmlnano
```

```js
const gulp = require('gulp');
const htmlnano = require('gulp-htmlnano');
const options = {
    removeComments: false
};

gulp.task('default', function() {
    return gulp
        .src('./index.html')
        .pipe(htmlnano(options))
        .pipe(gulp.dest('./build'));
});
```


## Javascript
```js
const htmlnano = require('htmlnano');
const options = {
    removeEmptyAttributes: false, // Disable the module "removeEmptyAttributes"
    collapseWhitespace: 'conservative' // Pass options to the module "collapseWhitespace"
};
// posthtml, posthtml-render, and posthtml-parse options
const postHtmlOptions = {
    sync: true, // https://github.com/posthtml/posthtml#usage
    lowerCaseTags: true, // https://github.com/posthtml/posthtml-parser#options
    quoteAllAttributes: false, // https://github.com/posthtml/posthtml-render#options
};

htmlnano
    // "preset" arg might be skipped (see "Presets" section below for more info)
    // "postHtmlOptions" arg might be skipped
    .process(html, options, preset, postHtmlOptions)
    .then(function (result) {
        // result.html is minified
    })
    .catch(function (err) {
        console.error(err);
    });
```


## PostHTML
Just add `htmlnano` as a final plugin:
```js
const posthtml = require('posthtml');
const options = {
    removeComments: false, // Disable the module "removeComments"
    collapseWhitespace: 'conservative' // Pass options to the module "collapseWhitespace"
};
const posthtmlPlugins = [
    /* other PostHTML plugins */

    require('htmlnano')(options)
];

const posthtmlOptions = {
    // See PostHTML docs
};

posthtml(posthtmlPlugins)
    .process(html, posthtmlOptions)
    .then(function (result) {
        // result.html is minified
    })
    .catch(function (err) {
        console.error(err);
    });
```