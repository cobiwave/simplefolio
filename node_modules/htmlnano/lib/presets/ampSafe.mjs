import safePreset from './safe.mjs';

/**
 * A safe preset for AMP pages (https://www.ampproject.org)
 */
export default { ...safePreset,
    collapseBooleanAttributes: {
        amphtml: true,
    },
    minifyJs: false,
};
