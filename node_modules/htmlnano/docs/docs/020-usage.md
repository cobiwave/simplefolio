# Usage
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


## Webpack

```sh
npm install html-minimizer-webpack-plugin --save-dev
npm install htmlnano --save-dev
```

```js
// webpack.config.js
const HtmlMinimizerWebpackPlugin = require('html-minimizer-webpack-plugin');
const htmlnano = require('htmlnano');

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new HtmlMinimizerWebpackPlugin({
                // Add HtmlMinimizerWebpackPlugin's option here, see https://webpack.js.org/plugins/html-minimizer-webpack-plugin/#options
                // test: /\.html(\?.*)?$/i,

                // Use htmlnano as HtmlMinimizerWebpackPlugin's minimizer
                minify: htmlnano.htmlMinimizerWebpackPluginMinify,
                minimizerOptions: {
                    // Add htmlnano's option here
                    removeComments: false, // Disable the module "removeComments"
                    collapseWhitespace: 'conservative' // Pass options to the module "collapseWhitespace"
                }
            })
        ]
    }
}
```



## Gulp
```bash
npm i -D gulp-posthtml htmlnano
```

```js
const gulp = require('gulp');
const posthtml = require('gulp-posthtml');
const htmlnano = require('htmlnano');
const options = {
    removeComments: false
};

gulp.task('default', function() {
    return gulp
        .src('./index.html')
        .pipe(posthtml([
            // Add `htmlnano` as a final plugin
            htmlnano(options)
        ]))
        .pipe(gulp.dest('./build'));
});
```
