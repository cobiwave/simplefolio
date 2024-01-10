import { optionalImport } from '../helpers.mjs';

// Adopts from https://github.com/kangax/html-minifier/blob/51ce10f4daedb1de483ffbcccecc41be1c873da2/src/htmlminifier.js#L209-L221
const tagsHaveUriValuesForAttributes = new Set([
    'a',
    'area',
    'link',
    'base',
    'object',
    'blockquote',
    'q',
    'del',
    'ins',
    'form',
    'input',
    'head',
    'audio',
    'embed',
    'iframe',
    'img',
    'script',
    'track',
    'video',
]);

const tagsHasHrefAttributes = new Set([
    'a',
    'area',
    'link',
    'base'
]);

const attributesOfImgTagHasUriValues = new Set([
    'src',
    'longdesc',
    'usemap'
]);

const attributesOfObjectTagHasUriValues = new Set([
    'classid',
    'codebase',
    'data',
    'usemap'
]);

const tagsHasCiteAttributes = new Set([
    'blockquote',
    'q',
    'ins',
    'del'
]);

const tagsHasSrcAttributes = new Set([
    'audio',
    'embed',
    'iframe',
    'img',
    'input',
    'script',
    'track',
    'video',
    /**
     * https://html.spec.whatwg.org/#attr-source-src
     *
     * Although most of browsers recommend not to use "src" in <source>,
     * but technically it does comply with HTML Standard.
     */
    'source'
]);

const isUriTypeAttribute = (tag, attr) => {
    return (
        tagsHasHrefAttributes.has(tag) && attr === 'href' ||
        tag === 'img' && attributesOfImgTagHasUriValues.has(attr) ||
        tag === 'object' && attributesOfObjectTagHasUriValues.has(attr) ||
        tagsHasCiteAttributes.has(tag) && attr === 'cite' ||
        tag === 'form' && attr === 'action' ||
        tag === 'input' && attr === 'usemap' ||
        tag === 'head' && attr === 'profile' ||
        tag === 'script' && attr === 'for' ||
        tagsHasSrcAttributes.has(tag) && attr === 'src'
    );
};

const isSrcsetAttribute = (tag, attr) => {
    return (
        tag === 'source' && attr === 'srcset' ||
        tag === 'img' && attr === 'srcset' ||
        tag === 'link' && attr === 'imagesrcset'
    );
};

const processModuleOptions = options => {
    // FIXME!
    // relateurl@1.0.0-alpha only supports URL while stable version (0.2.7) only supports string
    // should convert input into URL instance after relateurl@1 is stable
    if (typeof options === 'string') return options;
    if (options instanceof URL) return options.toString();

    return false;
};

const isLinkRelCanonical = ({ tag, attrs }) => {
    // Return false early for non-"link" tag
    if (tag !== 'link') return false;

    for (const [attrName, attrValue] of Object.entries(attrs)) {
        if (attrName.toLowerCase() === 'rel' && attrValue === 'canonical') return true;
    }

    return false;
};

const JAVASCRIPT_URL_PROTOCOL = 'javascript:';

let relateUrlInstance;
let STORED_URL_BASE;

/** Convert absolute url into relative url */
export default async function minifyUrls(tree, options, moduleOptions) {
    const RelateUrl = await optionalImport('relateurl');
    const srcset = await optionalImport('srcset');
    const terser = await optionalImport('terser');

    let promises = [];

    const urlBase = processModuleOptions(moduleOptions);

    // Invalid configuration, return tree directly
    if (!urlBase) return tree;

    /** Bring up a reusable RelateUrl instances (only once)
     *
     * STORED_URL_BASE is used to invalidate RelateUrl instances,
     * avoiding require.cache acrossing multiple htmlnano instance with different configuration,
     * e.g. unit tests cases.
     */
    if (!relateUrlInstance || STORED_URL_BASE !== urlBase) {
        if (RelateUrl) {
            relateUrlInstance = new RelateUrl(urlBase);
        }
        STORED_URL_BASE = urlBase;
    }

    tree.walk(node => {
        if (!node.attrs) return node;

        if (!node.tag) return node;

        if (!tagsHaveUriValuesForAttributes.has(node.tag)) return node;

        // Prevent link[rel=canonical] being processed
        // Can't be excluded by isUriTypeAttribute()
        if (isLinkRelCanonical(node)) return node;

        for (const [attrName, attrValue] of Object.entries(node.attrs)) {
            const attrNameLower = attrName.toLowerCase();

            if (isUriTypeAttribute(node.tag, attrNameLower)) {
                if (isJavaScriptUrl(attrValue)) {
                    promises.push(minifyJavaScriptUrl(node, attrName, terser));
                } else {
                    if (relateUrlInstance) {
                        // FIXME!
                        // relateurl@1.0.0-alpha only supports URL while stable version (0.2.7) only supports string
                        // the WHATWG URL API is very strict while attrValue might not be a valid URL
                        // new URL should be used, and relateUrl#relate should be wrapped in try...catch after relateurl@1 is stable
                        node.attrs[attrName] = relateUrlInstance.relate(attrValue);
                    }
                }

                continue;
            }

            if (isSrcsetAttribute(node.tag, attrNameLower)) {
                if (srcset) {
                    try {
                        const parsedSrcset = srcset.parse(attrValue, { strict: true });

                        node.attrs[attrName] = srcset.stringify(parsedSrcset.map(srcset => {
                            if (relateUrlInstance) {
                                srcset.url = relateUrlInstance.relate(srcset.url);
                            }

                            return srcset;
                        }));
                    } catch (e) {
                        // srcset will throw an Error for invalid srcset.
                    }
                }

                continue;
            }
        }

        return node;
    });

    if (promises.length > 0) return Promise.all(promises).then(() => tree);
    return Promise.resolve(tree);
}

function isJavaScriptUrl(url) {
    return typeof url === 'string' && url.toLowerCase().startsWith(JAVASCRIPT_URL_PROTOCOL);
}

const jsWrapperStart = 'function a(){';
const jsWrapperEnd = '}a();';

function minifyJavaScriptUrl(node, attrName, terser) {
    if (!terser) return Promise.resolve();

    let result = node.attrs[attrName];
    if (result) {
        result = jsWrapperStart + result.slice(JAVASCRIPT_URL_PROTOCOL.length) + jsWrapperEnd;

        return terser
            .minify(result, {}) // Default Option is good enough
            .then(({ code }) => {
                const minifiedJs = code.substring(
                    jsWrapperStart.length,
                    code.length - jsWrapperEnd.length
                );
                node.attrs[attrName] = JAVASCRIPT_URL_PROTOCOL + minifiedJs;
            });
    }

    return Promise.resolve();
}
