interface V8Interface {
  getHeapStatistics?: () => { total_available_size: number }
}

export {
  V8Interface
}
