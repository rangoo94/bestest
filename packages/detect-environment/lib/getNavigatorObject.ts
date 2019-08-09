import { BrowserNavigatorInterface } from './interfaces/BrowserNavigatorInterface'

/**
 * Get 'navigator' or navigator-like object,
 * to retrieve data about environment.
 *
 * @returns {BrowserNavigatorInterface|object}
 */
function getNavigatorObject (): BrowserNavigatorInterface {
  // @ts-ignore
  return typeof navigator === 'object' && navigator ? navigator : {
    userAgent: null,
    appCodeName: null,
    appName: null,
    appVersion: null,
    platform: null,
    hardwareConcurrency: null,
    deviceMemory: null
  }
}

export {
  getNavigatorObject
}
