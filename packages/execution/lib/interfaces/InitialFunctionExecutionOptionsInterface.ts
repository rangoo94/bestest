interface InitialFunctionExecutionOptionsInterface {
  maxExecutionsPerSample: number
  estimatedSampleDuration: number
  getCurrentTime: () => number
}

export {
  InitialFunctionExecutionOptionsInterface
}
