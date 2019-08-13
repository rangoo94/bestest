const baseExtensions = [ '.js', '.json', '.mjs', '.node' ]

/**
 * Compare function for sort() of available script extensions.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function compare (a: string, b: string): number {
  const aIndex = baseExtensions.indexOf(a)
  const bIndex = baseExtensions.indexOf(b)

  const aLength = a.length
  const bLength = b.length

  if (aIndex !== bIndex) {
    if (aIndex === -1) {
      return 1
    }

    if (bIndex === -1) {
      return -1
    }
  }

  if (aLength !== bLength) {
    return aLength < bLength ? 1 : -1
  }

  return aIndex < bIndex ? 1 : -1
}

/* tslint:disable */
const extensions = require.extensions as Record<string, Function> | undefined
/* tslint:enable */

const acceptedScriptExtensions = extensions ? Object.keys(extensions).sort(compare) : baseExtensions

export {
  acceptedScriptExtensions
}
