interface FunctionExecutionAnalysisInterface {
  executionsPerSample: number
  handler: () => void
  failed: boolean
  took: null | number // in picoseconds
}

export {
  FunctionExecutionAnalysisInterface
}
