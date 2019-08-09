import { NodejsEnvironmentDetailsInterface } from './interfaces/NodejsEnvironmentDetailsInterface'
import { getTotalAvailableHeapSize } from './getTotalAvailableHeapSize'
import { getAvailableCpus } from './getAvailableCpus'
import { getProcessObject } from './getProcessObject'
import { getOsPackage } from './getOsPackage'

/**
 * Get browser environment details,
 * based on 'navigator' object.
 *
 * @returns {NodejsEnvironmentDetailsInterface|object}
 */
function getNodejsEnvironmentDetails (): NodejsEnvironmentDetailsInterface {
  const os = getOsPackage()
  const process = getProcessObject()

  const version = typeof process.version === 'string'
    ? process.version.replace(/^v/, '')
    : process.version || null

  const cpus = os ? getAvailableCpus() : null

  return {
    name: version ? `Node.js ${version}` : 'Unknown',
    arch: process.arch || null,
    v8: (process.versions && process.versions.v8) || null,
    version: version,
    type: os ? os.type() : null,
    platform: os ? os.platform() : null,
    release: os ? os.release() : null,
    cpus: cpus,
    cpuCores: cpus ? cpus.reduce((acc, cpu) => acc + cpu.cores, 0) : null,
    memory: os ? os.totalmem() / 1024 / 1024 : null,
    totalHeapSize: getTotalAvailableHeapSize()
  }
}

export {
  getNodejsEnvironmentDetails
}
