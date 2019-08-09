import { CpuInformationInterface } from './CpuInformationInterface'

interface AbstractEnvironmentDetailsInterface {
  name: string | null
  version: string | null
  platform: string | null
  /** including virtual cores (multi-threading) */
  cpuCores: number | null
  cpus: CpuInformationInterface[] | null
  /** in megabytes */
  memory: number | null
  /** in megabytes */
  totalHeapSize: number | null
}

export {
  AbstractEnvironmentDetailsInterface
}
