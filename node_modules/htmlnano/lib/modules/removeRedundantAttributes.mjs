// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#JavaScript_types
export const redundantScriptTypes = new Set([
    'application/javascript',
    'application/ecmascript',
    'application/x-ecmascript',
    'application/x-javascript',
    'text/javascript',
    'text/ecmascript',
    'text/javascript1.0',
    'text/javascript1.1',
    'text/javascript1.2',
    'text/javascript1.3',
    'text/javascript1.4',
    'text/javascript1.5',
    'text/jscript',
    'text/livescript',
    'text/x-ecmascript',
    'text/x-javascript'
]);

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#missing-value-default
const missingValueDefaultAttributes = {
    'form': {
        'method': 'get'
    },

    input: {
        type: 'text'
    },

    button: {
        // https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type
        type: 'submit'
    },

    'script': {
        'language': 'javascript',
        'type': attrs => {
            for (const [attrName, attrValue] of Object.entries(attrs)) {
                if (attrName.toLowerCase() !== 'type') {
                    continue;
                }

                return redundantScriptTypes.has(attrValue);
            }

            return false;
        },
        // Remove attribute if the function returns false
        'charset': attrs => {
            // The charset attribute only really makes sense on “external” SCRIPT elements:
            // http://perfectionkills.com/optimizing-html/#8_script_charset
            return !attrs.src;
        }
    },

    'style': {
        'media': 'all',
        'type': 'text/css'
    },

    'link': {
        media: 'all',
        'type': attrs => {
            // https://html.spec.whatwg.org/multipage/links.html#link-type-stylesheet
            let isRelStyleSheet = false;
            let isTypeTextCSS = false;

            if (attrs) {
                for (const [attrName, attrValue] of Object.entries(attrs)) {
                    if (attrName.toLowerCase() === 'rel' && attrValue === 'stylesheet') {
                        isRelStyleSheet = true;
                    }
                    if (attrName.toLowerCase() === 'type' && attrValue === 'text/css') {
                        isTypeTextCSS = true;
                    }
                }
            }

            // Only "text/css" is redudant for link[rel=stylesheet]. Otherwise "type" shouldn't be removed
            return isRelStyleSheet && isTypeTextCSS;
        }
    },

    // See: https://html.spec.whatwg.org/#lazy-loading-attributes
    img: {
        'loading': 'eager',
        // https://html.spec.whatwg.org/multipage/embedded-content.html#dom-img-decoding
        decoding: 'auto'
    },
    iframe: {
        'loading': 'eager'
    },

    // https://html.spec.whatwg.org/multipage/media.html#htmltrackelement
    track: {
        kind: 'subtitles'
    },

    textarea: {
        // https://html.spec.whatwg.org/multipage/form-elements.html#dom-textarea-wrap
        wrap: 'soft'
    },

    area: {
        // https://html.spec.whatwg.org/multipage/image-maps.html#attr-area-shape
        shape: 'rect'
    }
};

const tagsHaveMissingValueDefaultAttributes = new Set(Object.keys(missingValueDefaultAttributes));

/** Removes redundant attributes */
export function onAttrs() {
    return (attrs, node) => {
        if (!node.tag) return attrs;

        const newAttrs = attrs;

        if (tagsHaveMissingValueDefaultAttributes.has(node.tag)) {
            const tagRedundantAttributes = missingValueDefaultAttributes[node.tag];

            for (const redundantAttributeName of Object.keys(tagRedundantAttributes)) {
                let tagRedundantAttributeValue = tagRedundantAttributes[redundantAttributeName];
                let isRemove = false;

                if (typeof tagRedundantAttributeValue === 'function') {
                    isRemove = tagRedundantAttributeValue(attrs);
                } else if (attrs[redundantAttributeName] === tagRedundantAttributeValue) {
                    isRemove = true;
                }

                if (isRemove) {
                    delete newAttrs[redundantAttributeName];
                }
            }
        }

        return newAttrs;
    };
}
