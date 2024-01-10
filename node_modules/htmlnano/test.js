const htmlnano = require('.');
// const posthtml = require('posthtml');
const safePreset = require('./lib/presets/safe');
// const options = {
    // minifySvg: false,
    // minifyJs: false,
// };
// // posthtml, posthtml-render, and posthtml-parse options
// const postHtmlOptions = {
//     sync: true, // https://github.com/posthtml/posthtml#usage
//     lowerCaseTags: true, // https://github.com/posthtml/posthtml-parser#options
//     quoteAllAttributes: false, // https://github.com/posthtml/posthtml-render#options
// };

// const html = `
// <!doctype html>
// <html lang="en">
// <head>
//   <meta charset="utf-8">
//   <title></title>
//   <script class="fob">alert(1)</script>
//   <script>alert(2)</script>
// </head>
// <body>
//     <script>alert(3)</script>
//     <script>alert(4)</script>
// </body>
// </html>
// `;

const options = {
    minifySvg: safePreset.minifySvg,
};
const html = `
<input type="text" class="form-control" name="testInput" autofocus="" autocomplete="off" id="testId"><a id="testId" href="#" class="testClass"></a><img width="20" src="../images/image.png" height="40" alt="image" class="cls" id="id2">
`;

htmlnano
    // "preset" arg might be skipped (see "Presets" section below for more info)
    // "postHtmlOptions" arg might be skipped
    .process(html)
    .then(function (result) {
        // result.html is minified
        console.log(result.html);
    })
    .catch(function (err) {
        console.error(err);
    });
