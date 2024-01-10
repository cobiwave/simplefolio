[![NPM][npm]][npm-url]
[![Deps][deps]][deps-url]
[![Tests][build]][build-url]
[![Coverage][cover]][cover-url]
[![Standard Code Style][code-style]][code-style-url]
[![Twitter][twitter]][twitter-url]

# PostHTML <img align="right" width="220" height="200" title="PostHTML" src="http://posthtml.github.io/posthtml/logo.svg">

PostHTML is a tool for transforming HTML/XML with JS plugins. PostHTML itself is very small. It includes only a HTML parser, a HTML node tree API and a node tree stringifier.

All HTML transformations are made by plugins. And these plugins are just small plain JS functions, which receive a HTML node tree, transform it, and return a modified tree.

For more detailed information about PostHTML in general take a look at the [docs][docs-url].

### Dependencies

| Name | Status | Description |
|:----:|:------:|:-----------:|
|[posthtml-parser][parser]|[![npm][parser-badge]][parser-npm]| Parser HTML/XML to PostHTMLTree |
|[posthtml-render][render]|[![npm][render-badge]][render-npm]| Render PostHTMLTree to HTML/XML |


[docs]: https://github.com/posthtml/posthtml/blob/master/docs

[parser]: https://github.com/posthtml/posthtml-parser
[parser-badge]: https://img.shields.io/npm/v/posthtml-parser.svg
[parser-npm]: https://npmjs.com/package/posthtml-parser

[render]: https://github.com/posthtml/posthtml-render
[render-badge]: https://img.shields.io/npm/v/posthtml-render.svg
[render-npm]: https://npmjs.com/package/posthtml-render

## Create to your project

```bash
npm init posthtml
```

## Install

```bash
npm i -D posthtml
```

## Usage

### API

**Sync**

```js
import posthtml from 'posthtml'

const html = `
  <component>
    <title>Super Title</title>
    <text>Awesome Text</text>
  </component>
`

const result = posthtml()
  .use(require('posthtml-custom-elements')())
  .process(html, { sync: true })
  .html

console.log(result)
```

```html
<div class="component">
  <div class="title">Super Title</div>
  <div class="text">Awesome Text</div>
</div>
```

> :warning: Async Plugins can't be used in sync mode and will throw an Error. It's recommended to use PostHTML asynchronously whenever possible.

**Async**

```js
import posthtml from 'posthtml'

const html = `
  <html>
    <body>
      <p class="wow">OMG</p>
    </body>
  </html>
`

posthtml(
  [
    require('posthtml-to-svg-tags')(),
    require('posthtml-extend-attrs')({
      attrsTree: {
        '.wow' : {
          id: 'wow_id',
          fill: '#4A83B4',
          'fill-rule': 'evenodd',
          'font-family': 'Verdana'
        }
      }
    })
  ])
  .process(html/*, options */)
  .then((result) =>  console.log(result.html))
```

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <text
    class="wow"
    id="wow_id"
    fill="#4A83B4"
    fill-rule="evenodd" font-family="Verdana">
      OMG
  </text>
</svg>
```

**Directives**

```js
import posthtml from 'posthtml'

const php = `
  <component>
    <title><?php echo $title; ?></title>
    <text><?php echo $article; ?></text>
  </component>
`

const result = posthtml()
  .use(require('posthtml-custom-elements')())
  .process(html, {
    directives: [
      { name: '?php', start: '<', end: '>' }
    ]
  })
  .html

console.log(result)
```

```html
<div class="component">
  <div class="title"><?php echo $title; ?></div>
  <div class="text"><?php echo $article; ?></div>
</div>
```

### [CLI](https://npmjs.com/package/posthtml-cli)

```bash
npm i posthtml-cli
```

```json
"scripts": {
  "posthtml": "posthtml -o output.html -i input.html -c config.json"
}
```

```bash
npm run posthtml
```

### [Gulp](https://gulpjs.com)

```bash
npm i -D gulp-posthtml
```

```js
import tap from 'gulp-tap'
import posthtml from 'gulp-posthtml'
import { task, src, dest } from 'gulp'

task('html', () => {
  let path

  const plugins = [ require('posthtml-include')({ root: `${path}` }) ]
  const options = {}

  src('src/**/*.html')
    .pipe(tap((file) => path = file.path))
    .pipe(posthtml(plugins, options))
    .pipe(dest('build/'))
})
```

Check [project-stub](https://github.com/posthtml/project-stub) for an example with Gulp

### [Grunt](https://gruntjs.com)

```bash
npm i -D grunt-posthtml
```

```js
posthtml: {
  options: {
    use: [
      require('posthtml-doctype')({ doctype: 'HTML 5' }),
      require('posthtml-include')({ root: './', encoding: 'utf-8' })
    ]
  },
  build: {
    files: [
      {
        dot: true,
        cwd: 'html/',
        src: ['*.html'],
        dest: 'tmp/',
        expand: true,
      }
    ]
  }
}
```

### [Webpack](https://webpack.js.org)

```bash
npm i -D html-loader posthtml-loader
```

#### v1.x

**webpack.config.js**

```js
const config = {
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'html!posthtml'
      }
    ]
  },
  posthtml: (ctx) => ({
    parser: require('posthtml-pug'),
    plugins: [
      require('posthtml-bem')()
    ]
  })
}

export default config
```

#### v2.x

**webpack.config.js**

```js
import { LoaderOptionsPlugin } from 'webpack'

const config = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          },
          {
            loader: 'posthtml-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new LoaderOptionsPlugin({
      options: {
        posthtml(ctx) {
          return {
            parser: require('posthtml-pug'),
            plugins: [
              require('posthtml-bem')()
            ]
          }
        }
      }
    })
  ]
}

export default config
```

### [Rollup](https://rollupjs.org/)

```bash
$ npm i rollup-plugin-posthtml -D
# or
$ npm i rollup-plugin-posthtml-template -D
```

```js
import { join } from 'path';

import posthtml from 'rollup-plugin-posthtml-template';
// or
// import posthtml from 'rollup-plugin-posthtml';

import sugarml from 'posthtml-sugarml';  // npm i posthtml-sugarml -D
import include from 'posthtml-include';  // npm i posthtml-include -D

export default {
  entry: join(__dirname, 'main.js'),
  dest: join(__dirname, 'bundle.js'),
  format: 'iife',
  plugins: [
    posthtml({
      parser: sugarml(),
      plugins: [include()],
      template: true  // only rollup-plugin-posthtml-template
    })
  ]
};
```

## Parser

```js
import pug from 'posthtml-pug'

posthtml().process(html, { parser: pug(options) }).then((result) => result.html)
```

| Name |Status|Description|
|:-----|:-----|:----------|
|[posthtml-pug][pug]|[![npm][pug-badge]][pug-npm]|Pug Parser|
|[sugarml][sugar]|[![npm][sugar-badge]][sugar-npm]|SugarML Parser|


[pug]: https://github.com/posthtml/posthtml-pug
[pug-badge]: https://img.shields.io/npm/v/posthtml-pug.svg
[pug-npm]: https://npmjs.com/package/posthtml-pug

[sugar]: https://github.com/posthtml/sugarml
[sugar-badge]: https://img.shields.io/npm/v/sugarml.svg
[sugar-npm]: https://npmjs.com/package/sugarml

## Plugins

In case you want to develop your own plugin, we recommend using [posthtml-plugin-starter][plugin] to get started.

- [posthtml-plugins](http://maltsev.github.io/posthtml-plugins)
- [awesome-posthtml](https://github.com/posthtml/awesome-posthtml)

[plugin]: https://github.com/posthtml/posthtml-plugin-starter

## Maintainers

<table>
  <tbody>
   <tr>
    <td align="center">
      <img width="150 height="150"
      src="https://avatars0.githubusercontent.com/u/2789192?s=460&v=4">
      <br />
      <a href="https://github.com/scrum">Ivan Demidov</a>
    </td>
    <td align="center">
      <img width="150 height="150"
      src="https://avatars.githubusercontent.com/u/1510217?v=3&s=150">
      <br />
      <a href="https://github.com/voischev">Ivan Voischev</a>
    </td>
   </tr>
  <tbody>
</table>

## Contributors

<a href="https://github.com/posthtml/posthtml/graphs/contributors"><img src="https://opencollective.com/posthtml/contributors.svg?width=890&button=false" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/posthtml#backer)]

<a href="https://opencollective.com/posthtml#backers" target="_blank"><img src="https://opencollective.com/posthtml/backers.svg?width=885&button=false"></a>


[npm]: https://img.shields.io/npm/v/posthtml.svg
[npm-url]: https://npmjs.com/package/posthtml

[deps]: https://david-dm.org/posthtml/posthtml.svg
[deps-url]: https://david-dm.org/posthtml/posthtml

[build]: https://github.com/posthtml/posthtml/workflows/Actions%20Status/badge.svg?style=flat-square
[build-url]: https://github.com/posthtml/posthtml/actions?query=workflow%3A%22CI+tests%22

[cover]: https://coveralls.io/repos/posthtml/posthtml/badge.svg?branch=master
[cover-url]: https://coveralls.io/r/posthtml/posthtml?branch=master

[code-style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[code-style-url]: http://standardjs.com/

[twitter]: https://badgen.net/twitter/follow/posthtml
[twitter-url]: https://twitter.com/PostHTML

[chat]: https://badges.gitter.im/posthtml/PostHTML.svg
[chat-url]: https://gitter.im/posthtml/posthtml?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"
[docs-url]: https://github.com/posthtml/posthtml/tree/master/docs
