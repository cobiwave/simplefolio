import { isComment } from '../helpers.mjs';

const noWhitespaceCollapseElements = new Set([
    'script',
    'style',
    'pre',
    'textarea'
]);

const noTrimWhitespacesArroundElements = new Set([
    // non-empty tags that will maintain whitespace around them
    'a', 'abbr', 'acronym', 'b', 'bdi', 'bdo', 'big', 'button', 'cite', 'code', 'del', 'dfn', 'em', 'font', 'i', 'ins', 'kbd', 'label', 'mark', 'math', 'nobr', 'object', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'svg', 'textarea', 'time', 'tt', 'u', 'var',
    // self-closing tags that will maintain whitespace around them
    'comment', 'img', 'input', 'wbr'
]);

const noTrimWhitespacesInsideElements = new Set([
    // non-empty tags that will maintain whitespace within them
    'a', 'abbr', 'acronym', 'b', 'big', 'del', 'em', 'font', 'i', 'ins', 'kbd', 'mark', 'nobr', 'rp', 's', 'samp', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'time', 'tt', 'u', 'var'
]);

const startsWithWhitespacePattern = /^\s/;
const endsWithWhitespacePattern = /\s$/;
// See https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace and https://infra.spec.whatwg.org/#ascii-whitespace
const multipleWhitespacePattern = /[\t\n\f\r ]+/g;
const NONE = '';
const SINGLE_SPACE = ' ';
const validOptions = ['all', 'aggressive', 'conservative'];

/** Collapses redundant whitespaces */
export default function collapseWhitespace(tree, options, collapseType, parent) {
    collapseType = validOptions.includes(collapseType) ? collapseType : 'conservative';

    tree.forEach((node, index) => {
        const prevNode = tree[index - 1];
        const nextNode = tree[index + 1];

        if (typeof node === 'string') {
            const parentNodeTag = parent && parent.node && parent.node.tag;
            const isTopLevel = !parentNodeTag || parentNodeTag === 'html' || parentNodeTag === 'head';
            const shouldTrim = (
                collapseType === 'all' ||
                isTopLevel ||
                /*
                 * When collapseType is set to 'aggressive', and the tag is not inside 'noTrimWhitespacesInsideElements'.
                 * the first & last space inside the tag will be trimmed
                 */
                collapseType === 'aggressive'
            );

            node = collapseRedundantWhitespaces(node, collapseType, shouldTrim, parent, prevNode, nextNode);
        }

        const isAllowCollapseWhitespace = !noWhitespaceCollapseElements.has(node.tag);
        if (node.content && node.content.length && isAllowCollapseWhitespace) {
            node.content = collapseWhitespace(node.content, options, collapseType, {
                node,
                prevNode,
                nextNode
            });
        }

        tree[index] = node;
    });

    return tree;
}


function collapseRedundantWhitespaces(text, collapseType, shouldTrim = false, parent, prevNode, nextNode) {
    if (!text || text.length === 0) {
        return NONE;
    }

    if (!isComment(text)) {
        text = text.replace(multipleWhitespacePattern, SINGLE_SPACE);
    }

    if (shouldTrim) {
        if (collapseType === 'aggressive') {
            if (!noTrimWhitespacesInsideElements.has(parent && parent.node && parent.node.tag)) {
                if (
                    // It is the first child node of the parent
                    !prevNode
                    // It is not the first child node, and prevNode not a text node, and prevNode is safe to trim around
                    || prevNode && prevNode.tag && !noTrimWhitespacesArroundElements.has(prevNode.tag)
                ) {
                    text = text.trimStart();
                } else {
                    // previous node is a "no trim whitespaces arround element"
                    if (
                        // but previous node ends with a whitespace
                        prevNode && prevNode.content && prevNode.content.length
                        && endsWithWhitespacePattern.test(prevNode.content[prevNode.content.length - 1])
                        && (
                            !nextNode // either the current node is the last child of the parent
                            || (
                                // or the next node starts with a white space
                                nextNode && nextNode.content && nextNode.content.length
                                && !startsWithWhitespacePattern.test(nextNode.content[0])
                            )
                        )
                    ) {
                        text = text.trimStart();
                    }
                }

                if (
                    !nextNode
                    || nextNode && nextNode.tag && !noTrimWhitespacesArroundElements.has(nextNode.tag)
                ) {
                    text = text.trimEnd();
                }
            } else {
                // now it is a textNode inside a "no trim whitespaces inside elements" node
                if (
                    !prevNode // it the textnode is the first child of the node
                    && startsWithWhitespacePattern.test(text[0]) // it starts with white space
                    && typeof parent.prevNode === 'string' // the prev of the node is a textNode as well
                    && endsWithWhitespacePattern.test(parent.prevNode[parent.prevNode.length - 1]) // that prev is ends with a white
                ) {
                    text = text.trimStart();
                }
            }
        } else {
            // collapseType is 'all', trim spaces
            text = text.trim();
        }
    }

    return text;
}
