import safePreset from './safe.mjs';

/**
 * Maximal minification (might break some pages)
 */
export default { ...safePreset,
    collapseWhitespace: 'all',
    removeComments: 'all',
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    mergeScripts: true,
    mergeStyles: true,
    removeUnusedCss: {},
    minifyCss: {
        preset: 'default',
    },
    minifySvg: {},
    minifyConditionalComments: true,
    removeOptionalTags: true,
};
