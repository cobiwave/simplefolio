const rNodeAttrsTypeJson = /(\/|\+)json/;

export function onContent() {
    return (content, node) => {
        // Skip SRI, reasons are documented in "minifyJs" module
        if (node.attrs && 'integrity' in node.attrs) {
            return content;
        }

        if (node.attrs && node.attrs.type && rNodeAttrsTypeJson.test(node.attrs.type)) {
            try {
                // cast minified JSON to an array
                return [JSON.stringify(JSON.parse((content || []).join('')))];
            } catch (error) {
                // Invalid JSON
            }
        }

        return content;
    };
}
