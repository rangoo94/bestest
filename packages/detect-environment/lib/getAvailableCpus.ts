import { CpuInfo } from 'os'
import { CpuInformationInterface } from './interfaces/CpuInformationInterface'
import { getOsPackage } from './getOsPackage'

/**
 * Get available CPUs,
 * based on native Node.js 'os' package information.
 *
 * @returns {CpuInformationInterface[]|object[]|null}
 */
function getAvailableCpus (): CpuInformationInterface[] | null {
  const os = getOsPackage()

  if (!os) {
    return null
  }

  const cpus = os.cpus().map((cpu: CpuInfo) => ({
    model: cpu.model,
    cores: 1,
    speed: cpu.speed
  }))

  const map: Record<string, CpuInformationInterface> = {}

  for (let i = 0; i < cpus.length; i++) {
    const cpu = cpus[i]
    const cpuId = cpu.model + '-' + cpu.speed

    if (map[cpuId]) {
      map[cpuId].cores++
    } else {
      map[cpuId] = cpu
    }
  }

  return Object.keys(map).map(key => map[key])
}

export {
  getAvailableCpus
}
