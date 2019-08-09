import { EnvironmentType } from './interfaces/EnvironmentType'
import { getOsPackage } from './getOsPackage'

/**
 * Determine current environment type.
 *
 * @returns {EnvironmentType|string}
 */
function getEnvironmentType (): EnvironmentType {
  if (typeof process !== 'undefined' && getOsPackage()) {
    return 'nodejs'
  }

  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    return 'browser'
  }

  return 'unknown'
}

export {
  getEnvironmentType
}
