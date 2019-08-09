interface FunctionExecutionMeasurementExecutionsAmountInterface {
  total: number
  successful: number
  failed: number
}

interface FunctionExecutionMeasurementTimeEntriesInterface {
  successful: number[]
  failed: number[]
}

interface FunctionExecutionMeasurementInterface {
  // Precision
  timePrecision: number // (in picoseconds)
  executionsPerSample: number
  concurrentExecutions: number

  // High resolution start and end time (in picoseconds)
  startTime: number
  endTime: number
  took: number

  // Number of executions during this time
  executions: FunctionExecutionMeasurementExecutionsAmountInterface

  // List of execution time for each iteration (per run, in picoseconds)
  timeEntries: FunctionExecutionMeasurementTimeEntriesInterface | undefined
}

export {
  FunctionExecutionMeasurementExecutionsAmountInterface,
  FunctionExecutionMeasurementTimeEntriesInterface,
  FunctionExecutionMeasurementInterface
}
