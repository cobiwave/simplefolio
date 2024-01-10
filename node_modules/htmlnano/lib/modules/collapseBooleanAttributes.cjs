"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onAttrs = onAttrs;
// Source: https://github.com/kangax/html-minifier/issues/63
// https://html.spec.whatwg.org/#boolean-attribute
// https://html.spec.whatwg.org/#attributes-1
const htmlBooleanAttributes = new Set(['allowfullscreen', 'allowpaymentrequest', 'allowtransparency', 'async', 'autofocus', 'autoplay', 'checked', 'compact', 'controls', 'declare', 'default', 'defaultchecked', 'defaultmuted', 'defaultselected', 'defer', 'disabled', 'enabled', 'formnovalidate', 'hidden', 'indeterminate', 'inert', 'ismap', 'itemscope', 'loop', 'multiple', 'muted', 'nohref', 'nomodule', 'noresize', 'noshade', 'novalidate', 'nowrap', 'open', 'pauseonexit', 'playsinline', 'readonly', 'required', 'reversed', 'scoped', 'seamless', 'selected', 'sortable', 'truespeed', 'typemustmatch', 'visible']);
const amphtmlBooleanAttributes = new Set(['⚡', 'amp', '⚡4ads', 'amp4ads', '⚡4email', 'amp4email', 'amp-custom', 'amp-boilerplate', 'amp4ads-boilerplate', 'amp4email-boilerplate', 'allow-blocked-ranges', 'amp-access-hide', 'amp-access-template', 'amp-keyframes', 'animate', 'arrows', 'data-block-on-consent', 'data-enable-refresh', 'data-multi-size', 'date-template', 'disable-double-tap', 'disable-session-states', 'disableremoteplayback', 'dots', 'expand-single-section', 'expanded', 'fallback', 'first', 'fullscreen', 'inline', 'lightbox', 'noaudio', 'noautoplay', 'noloading', 'once', 'open-after-clear', 'open-after-select', 'open-button', 'placeholder', 'preload', 'reset-on-refresh', 'reset-on-resize', 'resizable', 'rotate-to-fullscreen', 'second', 'standalone', 'stereo', 'submit-error', 'submit-success', 'submitting', 'subscriptions-actions', 'subscriptions-dialog']);
const missingValueDefaultEmptyStringAttributes = {
  // https://html.spec.whatwg.org/#attr-media-preload
  audio: {
    preload: 'auto'
  },
  video: {
    preload: 'auto'
  }
};
const tagsHasMissingValueDefaultEmptyStringAttributes = new Set(Object.keys(missingValueDefaultEmptyStringAttributes));
function onAttrs(options, moduleOptions) {
  return (attrs, node) => {
    if (!node.tag) return attrs;
    const newAttrs = attrs;
    if (tagsHasMissingValueDefaultEmptyStringAttributes.has(node.tag)) {
      const tagAttributesCanBeReplacedWithEmptyString = missingValueDefaultEmptyStringAttributes[node.tag];
      for (const attributesCanBeReplacedWithEmptyString of Object.keys(tagAttributesCanBeReplacedWithEmptyString)) {
        if (Object.prototype.hasOwnProperty.call(attrs, attributesCanBeReplacedWithEmptyString) && attrs[attributesCanBeReplacedWithEmptyString] === tagAttributesCanBeReplacedWithEmptyString[attributesCanBeReplacedWithEmptyString]) {
          attrs[attributesCanBeReplacedWithEmptyString] = true;
        }
      }
    }
    for (const attrName of Object.keys(attrs)) {
      if (attrName === 'visible' && node.tag.startsWith('a-')) {
        continue;
      }
      if (htmlBooleanAttributes.has(attrName)) {
        newAttrs[attrName] = true;
      }

      // Fast path optimization.
      // The rest of tranformations are only for string type attrValue.
      if (typeof newAttrs[attrName] !== 'string') continue;
      if (moduleOptions.amphtml && amphtmlBooleanAttributes.has(attrName) && attrs[attrName] === '') {
        newAttrs[attrName] = true;
      }
      // https://html.spec.whatwg.org/#a-quick-introduction-to-html
      // The value, along with the "=" character, can be omitted altogether if the value is the empty string.
      if (attrs[attrName] === '') {
        newAttrs[attrName] = true;
      }

      // collapse crossorigin attributes
      // Specification: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
      if (attrName.toLowerCase() === 'crossorigin' && attrs[attrName] === 'anonymous') {
        newAttrs[attrName] = true;
      }
    }
    return newAttrs;
  };
}