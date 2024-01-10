import { isStyleNode, extractCssFromStyleNode, optionalImport } from '../helpers.mjs';

// These options must be set and shouldn't be overriden to ensure uncss doesn't look at linked stylesheets.
const uncssOptions = {
    ignoreSheets: [/\s*/],
    stylesheets: [],
};

function processStyleNodeUnCSS(html, styleNode, uncssOptions, uncss) {
    const css = extractCssFromStyleNode(styleNode);

    return runUncss(html, css, uncssOptions, uncss).then(css => {
        // uncss may have left some style tags empty
        if (css.trim().length === 0) {
            styleNode.tag = false;
            styleNode.content = [];
            return;
        }
        styleNode.content = [css];
    });
}

function runUncss(html, css, userOptions, uncss) {
    if (typeof userOptions !== 'object') {
        userOptions = {};
    }

    const options = { ...userOptions, ...uncssOptions };
    return new Promise((resolve, reject) => {
        options.raw = css;
        uncss(html, options, (error, output) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(output);
        });
    });
}

const purgeFromHtml = function (tree) {
    // content is not used as we can directly used the parsed HTML,
    // making the process faster
    const selectors = [];

    tree.walk(node => {
        const classes = node.attrs && node.attrs.class && node.attrs.class.split(' ') || [];
        const ids = node.attrs && node.attrs.id && node.attrs.id.split(' ') || [];
        selectors.push(...classes, ...ids);
        node.tag && selectors.push(node.tag);
        return node;
    });

    return () => selectors;
};

function processStyleNodePurgeCSS(tree, styleNode, purgecssOptions, purgecss) {
    const css = extractCssFromStyleNode(styleNode);
    return runPurgecss(tree, css, purgecssOptions, purgecss)
        .then(css => {
            if (css.trim().length === 0) {
                styleNode.tag = false;
                styleNode.content = [];
                return;
            }
            styleNode.content = [css];
        });
}

function runPurgecss(tree, css, userOptions, purgecss) {
    if (typeof userOptions !== 'object') {
        userOptions = {};
    }

    const options = {
        ...userOptions,
        content: [{
            raw: tree,
            extension: 'html'
        }],
        css: [{
            raw: css,
            extension: 'css'
        }],
        extractors: [{
            extractor: purgeFromHtml(tree),
            extensions: ['html']
        }]
    };

    return new purgecss.PurgeCSS()
        .purge(options)
        .then((result) => {
            return result[0].css;
        });
}

/** Remove unused CSS */
export default async function removeUnusedCss(tree, options, userOptions) {
    const promises = [];
    const html = userOptions.tool !== 'purgeCSS' && tree.render(tree);

    const purgecss = await optionalImport('purgecss');
    const uncss = await optionalImport('uncss');

    tree.walk(node => {
        if (isStyleNode(node)) {
            if (userOptions.tool === 'purgeCSS') {
                if (purgecss) {
                    promises.push(processStyleNodePurgeCSS(tree, node, userOptions, purgecss));
                }
            } else {
                if (uncss) {
                    promises.push(processStyleNodeUnCSS(html, node, userOptions, uncss));
                }
            }
        }
        return node;
    });

    return Promise.all(promises).then(() => tree);
}
