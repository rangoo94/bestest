/**
 * Get native Node.js "OS" package,
 * or return null if it's not available in current environment.
 *
 * @returns {object|null}
 */
function getOsPackage () {
  try {
    return require('o' + 's')
  } catch (e) {
    return null
  }
}

export {
  getOsPackage
}
