"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onAttrs = onAttrs;
const caseInsensitiveAttributes = {
  autocomplete: ['form'],
  charset: ['meta', 'script'],
  contenteditable: null,
  crossorigin: ['audio', 'img', 'link', 'script', 'video'],
  dir: null,
  draggable: null,
  dropzone: null,
  formmethod: ['button', 'input'],
  inputmode: ['input', 'textarea'],
  kind: ['track'],
  method: ['form'],
  preload: ['audio', 'video'],
  referrerpolicy: null,
  sandbox: ['iframe'],
  spellcheck: null,
  scope: ['th'],
  shape: ['area'],
  sizes: ['link'],
  step: ['input'],
  translate: null,
  type: ['a', 'link', 'button', 'embed', 'object', 'script', 'source', 'style', 'input', 'menu', 'menuitem'],
  wrap: ['textarea']
};

// https://html.spec.whatwg.org/#invalid-value-default
/** @typedef { [key: string]: { tag: null | string[], default: string, valid: string[] } } */
const invalidValueDefault = {
  crossorigin: {
    tag: null,
    default: 'anonymous',
    valid: ['', 'anonymous', 'use-credentials']
  },
  // https://html.spec.whatwg.org/#referrer-policy-attributes
  // The attribute's invalid value default and missing value default are both the empty string state.
  referrerpolicy: {
    tag: null,
    default: '',
    valid: ['', 'url', 'origin', 'no-referrer', 'no-referrer-when-downgrade', 'same-origin', 'origin-when-cross-origin', 'strict-origin-when-cross-origin', 'unsafe-url']
  },
  // https://html.spec.whatwg.org/#lazy-loading-attributes
  loading: {
    tag: ['img', 'iframe'],
    default: 'eager',
    valid: ['lazy', 'eager']
  },
  // https://html.spec.whatwg.org/#the-img-element
  // https://html.spec.whatwg.org/#image-decoding-hint
  decoding: {
    tag: ['img'],
    default: 'auto',
    valid: ['auto', 'sync', 'async']
  },
  // https://html.spec.whatwg.org/#the-track-element
  kind: {
    tag: ['track'],
    default: 'metadata',
    valid: ['subtitles', 'captions', 'descriptions', 'chapters', 'metadata']
  },
  type: {
    tag: ['button'],
    default: 'submit',
    valid: ['submit', 'reset', 'button']
  },
  wrap: {
    tag: ['textarea'],
    default: 'soft',
    valid: ['soft', 'hard']
  },
  // https://html.spec.whatwg.org/#the-hidden-attribute
  hidden: {
    tag: null,
    default: 'hidden',
    valid: ['hidden', 'until-found']
  },
  // https://html.spec.whatwg.org/#autocapitalization
  autocapitalize: {
    tag: null,
    default: 'sentences',
    valid: ['none', 'off', 'on', 'sentences', 'words', 'characters']
  },
  // https://html.spec.whatwg.org/#the-marquee-element
  behavior: {
    tag: ['marquee'],
    default: 'scroll',
    valid: ['scroll', 'slide', 'alternate']
  },
  direction: {
    tag: ['marquee'],
    default: 'left',
    valid: ['left', 'right', 'up', 'down']
  }
};
function onAttrs() {
  return (attrs, node) => {
    const newAttrs = attrs;
    Object.entries(attrs).forEach(([attrName, attrValue]) => {
      let newAttrValue = attrValue;
      if (Object.hasOwnProperty.call(caseInsensitiveAttributes, attrName) && (caseInsensitiveAttributes[attrName] === null || caseInsensitiveAttributes[attrName].includes(node.tag))) {
        newAttrValue = typeof attrValue.toLowerCase === 'function' ? attrValue.toLowerCase() : attrValue;
      }
      if (Object.hasOwnProperty.call(invalidValueDefault, attrName)) {
        const meta = invalidValueDefault[attrName];
        if (meta.tag === null || node && node.tag && meta.tag.includes(node.tag)) {
          if (!meta.valid.includes(newAttrValue)) {
            newAttrValue = meta.default;
          }
        }
      }
      newAttrs[attrName] = newAttrValue;
    });
    return newAttrs;
  };
}