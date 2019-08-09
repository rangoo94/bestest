import { V8Interface } from './interfaces/V8Interface'

/**
 * Get native Node.js "V8" package,
 * or return null if it's not available in current environment.
 *
 * @returns {object|null}
 */
function getV8Package (): V8Interface | null {
  try {
    return require('v' + '8')
  } catch (e) {
    return null
  }
}

export {
  getV8Package
}
