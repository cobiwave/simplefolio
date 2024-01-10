const ampBoilerplateAttributes = [
    'amp-boilerplate',
    'amp4ads-boilerplate',
    'amp4email-boilerplate'
];

export function isAmpBoilerplate(node) {
    if (!node.attrs) {
        return false;
    }
    for (const attr of ampBoilerplateAttributes) {
        if (attr in node.attrs) {
            return true;
        }
    }
    return false;
}

export function isComment(content) {
    if (typeof content === 'string') {
        return content.trim().startsWith('<!--');
    }
    return false;
}

export function isConditionalComment(content) {
    return (content || '').trim().startsWith('<!--[if');
}

export function isStyleNode(node) {
    return node.tag === 'style' && !isAmpBoilerplate(node) && 'content' in node && node.content.length > 0;
}

export function extractCssFromStyleNode(node) {
    return Array.isArray(node.content) ? node.content.join(' ') : node.content;
}

export function isEventHandler(attributeName) {
    return attributeName && attributeName.slice && attributeName.slice(0, 2).toLowerCase() === 'on' && attributeName.length >= 5;
}

export async function optionalImport(moduleName) {
    try {
        const module = await import(moduleName);
        return module.default || module;
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND' || e.code === 'ERR_MODULE_NOT_FOUND') {
            return null;
        }
        throw e;
    }
}
