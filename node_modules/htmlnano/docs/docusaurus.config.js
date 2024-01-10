const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'htmlnano',
    tagline: 'Modular HTML minifier',
    url: 'https://htmlnano.netlify.app',
    favicon: 'favicon.ico',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    organizationName: 'posthtml',
    projectName: 'htmlnano',
    trailingSlash: false,
    plugins: ['docusaurus-plugin-goatcounter'],
    themeConfig: {
        navbar: {
            title: 'htmlnano',
            items: [
                {
                    type: 'docsVersionDropdown',
                    position: 'right',
                    dropdownActiveClassDisabled: true,
                },
                {
                    href: 'https://github.com/posthtml/htmlnano',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme,
        },
        goatcounter: {
            code: 'htmlnano',
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    routeBasePath: '/',
                    editUrl: 'https://github.com/posthtml/htmlnano/edit/master/docs/',
                },
            },
        ],
    ],
};


const algoliaConfig = {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_API_KEY,
    indexName: 'htmlnano',
    contextualSearch: true,
};

if (algoliaConfig.apiKey) {
    module.exports.themeConfig.algolia = algoliaConfig;
}
