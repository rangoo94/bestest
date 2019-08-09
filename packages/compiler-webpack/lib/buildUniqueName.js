"use strict";
exports.__esModule = true;
/**
 * Ensure unique name - when it already exists, try to increase beginning index.
 *
 * @param {string} name
 * @param {string[]} existingNames
 * @returns {string}
 */
function buildUniqueName(name, existingNames) {
    // When it doesn't exists, use it
    if (existingNames.indexOf(name) === -1) {
        return name;
    }
    // Iterate to find unique index prefix
    var i = 1;
    while (existingNames.indexOf(i + "-" + name) !== -1) {
        i++;
    }
    return i + "-" + name;
}
exports.buildUniqueName = buildUniqueName;
