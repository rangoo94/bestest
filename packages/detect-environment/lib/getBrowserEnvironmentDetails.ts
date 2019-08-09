import { BrowserEnvironmentDetailsInterface } from './interfaces/BrowserEnvironmentDetailsInterface'
import { getNavigatorObject } from './getNavigatorObject'

/**
 * Get browser environment details,
 * based on 'navigator' object.
 *
 * @returns {BrowserEnvironmentDetailsInterface|object}
 */
function getBrowserEnvironmentDetails (): BrowserEnvironmentDetailsInterface {
  const nav = getNavigatorObject()

  return {
    name: nav.userAgent || null,
    appCodeName: nav.appCodeName || null,
    appName: nav.appName || null,
    isJsDom: nav.userAgent ? nav.userAgent.indexOf('jsdom') !== -1 : null,
    version: nav.appVersion || null,
    platform: nav.platform || null,
    cpuCores: nav.hardwareConcurrency || null,
    cpus: null,
    totalHeapSize: null,
    memory: nav.deviceMemory == null ? null : nav.deviceMemory * 1024
  }
}

export {
  getBrowserEnvironmentDetails
}
