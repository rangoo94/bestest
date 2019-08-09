import { ProcessInterface } from './interfaces/ProcessInterface'

/**
 * Get 'process' or process-like object,
 * to retrieve data about environment.
 *
 * @returns {ProcessInterface|object}
 */
function getProcessObject (): ProcessInterface {
  return typeof process === 'object' && process ? process : {
    arch: null,
    version: null,
    versions: { v8: null }
  }
}

export {
  getProcessObject
}
