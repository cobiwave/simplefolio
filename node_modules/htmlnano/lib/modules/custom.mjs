/** Meta-module that runs custom modules  */
export default function custom(tree, options, customModules) {
    if (! customModules) {
        return tree;
    }

    if (! Array.isArray(customModules)) {
        customModules = [customModules];
    }

    customModules.forEach(customModule => {
        tree = customModule(tree, options);
    });

    return tree;
}
