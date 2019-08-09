interface CpuInformationInterface {
  model: string
  /** in MHz */
  speed: number
  /** Number of virtual cores with such specification */
  cores: number
}

export {
  CpuInformationInterface
}
