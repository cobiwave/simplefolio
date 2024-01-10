# Modules

By default the modules should only perform safe transforms, see the module documentation below for details.
You can disable modules by passing `false` as option, and enable them by passing `true`.

The order in which the modules are documented is also the order in which they are applied.

## Attributes

### normalizeAttributeValues

- Normalize casing of specific attribute values that are case-insensitive (like `form[method]`, `img[img]` and `input[type]`).
- Apply [invalid value default](https://html.spec.whatwg.org/#invalid-value-default) attribute to invalid attribute values (like `<input type=foo>` to `<input type=text>`, which can then be minified to `<input>` by `removeRedundantAttributes` module).
#### Example

Source:

```html
<form method="GET"></form>
```

Minified:

```html
<form method="get"></form>
```

### removeEmptyAttributes
Removes empty [safe-to-remove](https://github.com/posthtml/htmlnano/blob/master/lib/modules/removeEmptyAttributes.mjs) attributes.

#### Side effects
This module could break your styles or JS if you use selectors with attributes:
```CSS
img[style=""] {
    margin: 10px;
}
```

#### Example
Source:
```html
<img src="foo.jpg" alt="" style="">
```

Minified:
```html
<img src="foo.jpg" alt="">
```

### collapseAttributeWhitespace
Collapse redundant white spaces in list-like attributes (`class`, `rel`, `ping`).

#### Example
Source:
```html
<a class=" content  page  " style="  display: block;    " href="   https://example.com"></a>
```

Minified:
```html
<a class="content page" style="display: block;" href="https://example.com"></a>
```

### removeRedundantAttributes
Removes redundant attributes from tags if they contain default values:
- `method="get"` from `<form>`
- `type="text"` from `<input>`
- `type="submit"` from `<button>`
- `language="javascript"` and `type="text/javascript"` from `<script>`
- `charset` from `<script>` if it's an external script
- `media="all"` from `<style>` and `<link>`
- `type="text/css"` from `<link rel="stylesheet">`

#### Options
This module is disabled by default, change option to true to enable this module.

#### Side effects
This module could break your styles or JS if you use selectors with attributes:
```CSS
form[method="get"] {
    color: red;
}
```

#### Example
Source:
```html
<form method="get">
    <input type="text">
</form>
```

Minified:
```html
<form>
    <input>
</form>
```

### collapseBooleanAttributes

- Collapses boolean attributes (like `disabled`) to the minimized form.
- Collapses empty string value attributes (like `href=""`) to the minimized form.
- Collapses [missing value default](https://html.spec.whatwg.org/#missing-value-default) attributes that are empty strings (`audio[preload=auto]` and `video[preload=auto]`) to the minimized form.

#### Options
If your document uses [AMP](https://www.ampproject.org/), set the `amphtml` flag
to collapse additonal, AMP-specific boolean attributes:
```Json
"collapseBooleanAttributes": {
    "amphtml": true
}
```

#### Side effects
This module could break your styles or JS if you use selectors with attributes:
```CSS
button[disabled="disabled"] {
    color: red;
}
```

#### Example
Source:
```html
<button disabled="disabled">click</button>
<script defer=""></script>
<a href=""></a>
<video preload="auto"></video>
```

Minified:
```html
<button disabled>click</button>
<script defer></script>
<a href></a>
<video preload></video>
```

### deduplicateAttributeValues
Remove duplicate values from list-like attributes (`class`, `rel`, `ping`).

#### Example
Source:
```html
<div class="sidebar left sidebar"></div>
```

Minified:
```html
<div class="sidebar left"></div>
```

### minifyUrls
Convert absolute URL to relative URL using [relateurl](https://www.npmjs.com/package/relateurl).

You have to install `relateurl`, `terser` and `srcset` in order to use this feature:

```bash
npm install --save-dev relateurl terser srcset
# if you prefer yarn
# yarn add --dev relateurl terser srcset
# if you prefer pnpm
# pnpm install --save-dev relateurl terser srcset
```

#### Options

The base URL to resolve against. Support `String` & `URL`.

```js
htmlnano.process(html, {
    minifyUrls: 'https://example.com' // Valid configuration
});
```

```js
htmlnano.process(html, {
    minifyUrls: new URL('https://example.com') // Valid configuration
});
```

```js
htmlnano.process(html, {
    minifyUrls: false // The module will be disabled
});
```

```js
htmlnano.process(html, {
    minifyUrls: true // Invalid configuration, the module will be disabled
});
```

#### Example

**Basic Usage**

Configuration:

```js
htmlnano.process(html, {
    minifyUrls: 'https://example.com'
});
```

Source:

```html
<a href="https://example.com/foo/bar/baz">bar</a>
```

Minified:

```html
<a href="foo/bar/baz">bar</a>
```

**With sub-directory**

Configuration:

```js
htmlnano.process(html, {
    minifyUrls: 'https://example.com/foo/baz/'
});
```

Source:

```html
<a href="https://example.com/foo/bar">bar</a>
```

Minified:

```html
<a href="../bar">bar</a>
```


### sortAttributes
Sort attributes inside elements.

The module won't impact the plain-text size of the output. However it will improve the compression ratio of gzip/brotli used in HTTP compression.

#### Options

- `alphabetical`: Default option. Sort attributes in alphabetical order.
- `frequency`: Sort attributes by frequency.

#### Example

**alphabetical**

Source:
```html
<input type="text" class="form-control" name="testInput" autofocus="" autocomplete="off" id="testId">
```

Processed:
```html
<input autocomplete="off" autofocus="" class="form-control" id="testId" name="testInput" type="text">
```

**frequency**

Source:
```html
<input type="text" class="form-control" name="testInput" id="testId">
<a id="testId" href="#" class="testClass"></a>
<img width="20" src="../images/image.png" height="40" alt="image" class="cls" id="id2">
```

Processed:
```html
<input class="form-control" id="testId" type="text" name="testInput">
<a class="testClass" id="testId" href="#"></a>
<img class="cls" id="id2" width="20" src="../images/image.png" height="40" alt="image">
```



### sortAttributesWithLists
Sort values in list-like attributes (`class`, `rel`, `ping`).

The module won't impact the plain-text size of the output. However it will improve the compression ratio of gzip/brotli used in HTTP compression.

#### Options

- `alphabetical`: Default option. Sort attribute values in alphabetical order.
- `frequency`: Sort attribute values by frequency.

#### Example

**alphabetical**

Source:
```html
<div class="foo baz bar">click</div>
```

Processed:
```html
<div class="bar baz foo">click</div>
```

**frequency**

Source:
```html
<div class="foo baz bar"></div><div class="bar foo"></div>
```

Processed:
```html
<div class="foo bar baz"></div><div class="foo bar"></div>
```




#### Options
- `conservative` — collapses all redundant white spaces to 1 space (default)
- `aggressive` — collapses all whitespaces that are redundant and safe to remove
- `all` — collapses all redundant white spaces

#### Side effects

*all*
`<i>hello</i> <i>world</i>` or `<i>hello</i><br><i>world</i>` after minification will be rendered as `helloworld`.
To prevent that use either the default `conservative` option, or the `aggressive` option.

#### Example
Source:
```html
<div>
    hello  world!
    <a href="#">answer</a>
    <style>div  { color: red; }  </style>
    <main></main>
</div>
```

Minified (with `all`):
```html
<div>hello world!<a href="#">answer</a><style>div  { color: red; }  </style><main></main></div>
```

Minified (with `aggressive`):
```html
<div> hello world! <a href="#">answer</a> <style>div  { color: red; }  </style><main></main></div>
```

Minified (with `conservative`):
```html
<div> hello world! <a href="#">answer</a> <style>div  { color: red; }  </style> <main></main> </div>
```



## HTML Content

### collapseWhitespace
Collapses redundant white spaces (including new lines). It doesn’t affect white spaces in the elements `<style>`, `<textarea>`, `<script>` and `<pre>`.


### removeComments
#### Options
- `safe` – removes all HTML comments except the conditional comments and  [`<!--noindex--><!--/noindex-->`](https://yandex.com/support/webmaster/controlling-robot/html.xml) (default)
- `all` — removes all HTML comments
- A `RegExp` — only HTML comments matching the given regexp will be removed.
- A `Function` that returns boolean — removes HTML comments that can make the given callback function returns truthy value.

#### Example

Source:

```js
{
    removeComments: 'all'
}
```

```html
<div><!-- test --></div>
```

Minified:

```html
<div></div>
```

Source:

```js
{
    removeComments: /<!--(\/)?noindex-->/
}
```

```html
<div><!--noindex-->this text will not be indexed<!--/noindex-->Lorem ipsum dolor sit amet<!--more-->Lorem ipsum dolor sit amet</div>
```

Minified:

```html
<div>this text will not be indexedLorem ipsum dolor sit amet<!--more-->Lorem ipsum dolor sit amet</div>
```

Source:

```js
{
    removeComments: (comments) => {
        if (comments.includes('noindex')) return true;
        return false;
    }
}
```

```html
<div><!--noindex-->this text will not be indexed<!--/noindex-->Lorem ipsum dolor sit amet<!--more-->Lorem ipsum dolor sit amet</div>
```

Minified:

```html
<div>this text will not be indexedLorem ipsum dolor sit amet<!--more-->Lorem ipsum dolor sit amet</div>
```

### removeOptionalTags
Remove certain tags that can be omitted, see [HTML Standard - 13.1.2.4 Optional tags](https://html.spec.whatwg.org/multipage/syntax.html#optional-tags).

#### Example

Source:

```html
<html><head><title>Title</title></head><body><p>Hi</p></body></html>
```

Minified:

```html
<title>Title</title><p>Hi</p>
```

#### Notice
Due to [the limitation of PostHTML](https://github.com/posthtml/htmlnano/issues/99), htmlnano can't remove only the start tag or the end tag of an element. Currently, htmlnano only supports removing the following optional tags, as htmlnano can remove their start tag and end tag at the same time:

- `html`
- `head`
- `body`
- `colgroup`
- `tbody`

### removeOptionalTags
Remove certain tags that can be omitted, see [HTML Standard - 13.1.2.4 Optional tags](https://html.spec.whatwg.org/multipage/syntax.html#optional-tags).

#### Example

Source:

```html
<html><head><title>Title</title></head><body><p>Hi</p></body></html>
```

Minified:

```html
<title>Title</title><p>Hi</p>
```

#### Notice
Due to [the limitation of PostHTML](https://github.com/posthtml/htmlnano/issues/99), htmlnano can't remove only the start tag or the end tag of an element. Currently, htmlnano only supports removing the following optional tags, as htmlnano can remove their start tag and end tag at the same time:

- `html`
- `head`
- `body`
- `colgroup`
- `tbody`

### removeAttributeQuotes
Remove quotes around attributes when possible, see [HTML Standard - 12.1.2.3 Attributes - Unquoted attribute value syntax](https://html.spec.whatwg.org/multipage/syntax.html#attributes-2).

#### Example
Source:
```html
<div class="foo" title="hello world"></div>
```

Minified:
```html
<div class=foo title="hello world"></div>
```

#### Notice
The feature is implemented by [posthtml-render's `quoteAllAttributes`](https://github.com/posthtml/posthtml-render#options), which is one of the PostHTML's option. So `removeAttributeQuotes` could be overriden by other PostHTML's plugins and PostHTML's configuration.

For example:

```js
posthtml([
    htmlnano({
        removeAttributeQuotes: true
    })
]).process(html, {
    quoteAllAttributes: true
})
```

`removeAttributeQuotes` will not work because PostHTML's `quoteAllAttributes` takes the priority.


## `<style>`, `<script>` and `<svg>` Tags
### mergeStyles
Merges multiple `<style>` with the same `media` and `type` into one tag.
`<style scoped>...</style>` are skipped.

#### Example
Source:
```html
<style>h1 { color: red }</style>
<style media="print">div { color: blue }</style>

<style type="text/css" media="print">a {}</style>
<style>div { font-size: 20px }</style>
```

Minified:
```html
<style>h1 { color: red } div { font-size: 20px }</style>
<style media="print">div { color: blue } a {}</style>
```


### mergeScripts
Merge multiple `<script>` with the same attributes (`id, class, type, async, defer`) into one (last) tag.

#### Side effects
It could break your code if the tags with different attributes share the same variable scope.
See the example below.

#### Example
Source:
```html
<script>const foo = 'A:1';</script>
<script class="test">foo = 'B:1';</script>
<script type="text/javascript">foo = 'A:2';</script>
<script defer>foo = 'C:1';</script>
<script>foo = 'A:3';</script>
<script defer="defer">foo = 'C:2';</script>
<script class="test" type="text/javascript">foo = 'B:2';</script>
```

Minified:
```html
<script>const foo = 'A:1'; foo = 'A:2'; foo = 'A:3';</script>
<script defer="defer">foo = 'C:1'; foo = 'C:2';</script>
<script class="test" type="text/javascript">foo = 'B:1'; foo = 'B:2';</script>
```


### minifyCss
Minifies CSS with [cssnano](http://cssnano.co/) inside `<style>` tags and `style` attributes.

You have to install `cssnano` and `postcss` in order to use this feature:

```bash
npm install --save-dev cssnano postcss
# if you prefer yarn
# yarn add --dev cssnano postcss
# if you prefer pnpm
# pnpm install --save-dev cssnano postcss
```

#### Options
See [the documentation of cssnano](http://cssnano.co/docs/optimisations/) for all supported optimizations.
By default CSS is minified with preset `default`, which shouldn't have any side-effects.

To use another preset or disabled some optimizations pass options to `minifyCss` module:
```js
htmlnano.process(html, {
    minifyCss: {
        preset: ['default', {
            discardComments: {
                removeAll: true,
            },
        }]
    }
});
```

#### Example
Source:
```html
<div>
    <style>
        h1 {
            margin: 10px 10px 10px 10px;
            color: #ff0000;
        }
    </style>
</div>
```

Minified:
```html
<div>
    <style>h1{margin:10px;color:red}</style>
</div>
```


### minifyJs
Minifies JS using [Terser](https://github.com/fabiosantoscode/terser) inside `<script>` tags.

You have to install `terser` in order to use this feature:

```bash
npm install --save-dev terser
# if you prefer yarn
# yarn add --dev terser
# if you prefer pnpm
# pnpm install --save-dev terser
```

#### Options
See [the documentation of Terser](https://github.com/fabiosantoscode/terser#api-reference) for all supported options.
Terser options can be passed directly to the `minifyJs` module:
```js
htmlnano.process(html, {
    minifyJs: {
        output: { quote_style: 1 },
    },
});
```



#### Example
Source:
```html
<div>
    <script>
        /* comment */
        const foo = function () {

        };
    </script>
</div>
```

Minified:
```html
<div>
    <script>const foo=function(){};</script>
</div>
```


### minifyJson
Minifies JSON inside `<script type="application/json"></script>`.

#### Example
Source:
```html
<script type="application/json">
{
    "user": "me"
}
</script>
```

Minified:
```html
<script type="application/json">{"user":"me"}</script>
```


### minifySvg
Minifies SVG inside `<svg>` tags using [SVGO](https://github.com/svg/svgo/).

#### Options
See [the documentation of SVGO](https://github.com/svg/svgo/blob/master/README.md) for all supported options.
SVGO options can be passed directly to the `minifySvg` module:
```js
htmlnano.process(html, {
    minifySvg: {
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        builtinPluginName: {
                            optionName: 'optionValue'
                        },
                    },
                },
            }
        ]
    }
});
```

#### Example
Source:
```html
<svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="red" />

    <circle cx="150" cy="100" r="80" fill="green" />

    <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
</svg>`
```

Minified:
```html
<svg baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="red"/><circle cx="150" cy="100" r="80" fill="green"/><text x="150" y="125" font-size="60" text-anchor="middle" fill="#fff">SVG</text></svg>
```

### removeUnusedCss

Removes unused CSS inside `<style>` tags with either [uncss](https://github.com/uncss/uncss)
or [PurgeCSS](https://github.com/FullHuman/purgecss).

#### With uncss

You have to install `uncss` in order to use this feature:

```bash
npm install --save-dev uncss
# if you prefer yarn
# yarn add --dev uncss
# if you prefer pnpm
# pnpm install --save-dev uncss
```

You can also use a mainted fork [@novaatwarren/uncss](https://www.npmjs.com/package/@novaatwarren/uncss) instead.


##### Options
See [the documentation of uncss](https://github.com/uncss/uncss) for all supported options.

uncss options can be passed directly to the `removeUnusedCss` module:
```js
htmlnano.process(html, {
    removeUnusedCss: {
        ignore: ['.do-not-remove']
    }
});
```

The following uncss options are ignored if passed to the module:

-   `stylesheets`
-   `ignoreSheets`
-   `raw`

#### With PurgeCSS

Use PurgeCSS instead of uncss by adding `tool: 'purgeCSS'` to the options.

You have to install `purgecss` in order to use this feature:

```bash
npm install --save-dev purgecss
# if you prefer yarn
# yarn add --dev purgecss
# if you prefer pnpm
# pnpm install --save-dev purgecss
```

##### Options

See [the documentation of PurgeCSS](https://www.purgecss.com) for all supported options.

PurgeCSS options can be passed directly to the `removeUnusedCss` module:
```js
htmlnano.process(html, {
    removeUnusedCss: {
        tool: 'purgeCSS',
        safelist: ['.do-not-remove']
    }
});
```

The following PurgeCSS options are ignored if passed to the module:

-   `content`
-   `css`
-   `extractors`

#### Example
Source:
```html
<div class="b">
    <style>
        .a {
            margin: 10px 10px 10px 10px;
        }
        .b {
            color: #ff0000;
        }
    </style>
</div>
```

Optimized:
```html
<div class="b">
    <style>
        .b {
            color: #ff0000;
        }
    </style>
</div>
```

## Miscellaneous

### custom
It's also possible to pass custom modules in the minifier.
As a function:
```js
const options = {
    custom: function (tree, options) {
        // Some minification
        return tree;
    }
};
```

Or as a list of functions:
```js
const options = {
    custom: [
        function (tree, options) {
            // Some minification
            return tree;
        },

        function (tree, options) {
            // Some other minification
            return tree;
        }
    ]
};
```

htmlnano's options are passed to your custom plugin by the second parameter `options`.
