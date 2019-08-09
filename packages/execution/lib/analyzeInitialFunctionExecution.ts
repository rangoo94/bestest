import { createFunctionExecutionHandler } from './createFunctionExecutionHandler'
import { FunctionExecutionAnalysisInterface } from './interfaces/FunctionExecutionAnalysisInterface'
import { InitialFunctionExecutionOptionsInterface } from './interfaces/InitialFunctionExecutionOptionsInterface'
import { SynchronousTestFunctionType } from './interfaces/SynchronousTestFunctionType'

/**
 * Analyze initial (synchronous) function execution,
 * to decide how it should be measured.
 *
 * @param {Function} fn
 * @param {object} options
 * @param {number} options.maxExecutionsPerSample
 * @param {number} options.estimatedSampleDuration  in milliseconds
 * @param {function: number} options.measureTime  returns high-resolution time in picoseconds
 * @returns {FunctionExecutionAnalysisInterface|object}
 */
function analyzeInitialFunctionExecution (
  fn: SynchronousTestFunctionType,
  options: InitialFunctionExecutionOptionsInterface
): FunctionExecutionAnalysisInterface {
  // Extract options
  const { maxExecutionsPerSample, estimatedSampleDuration, getCurrentTime } = options

  // Do not take any sample for a function,
  // when only single execution per run is allowed.
  if (maxExecutionsPerSample < 2) {
    return {
      executionsPerSample: 1,
      handler: createFunctionExecutionHandler(fn, 1),
      failed: false,
      took: null
    }
  }

  // Initialize variables before time measurement,
  // to eliminate additional actions which may affect time.
  let startTime = getCurrentTime()
  let took = 0
  let failed = false

  try {
    // Get starting time
    startTime = getCurrentTime()

    // Execute a function
    fn()

    // Measure execution time
    took = getCurrentTime() - startTime
  } catch (error) {
    // Measure execution time
    took = getCurrentTime() - startTime
    failed = true
  }

  // Estimate runs per iteration
  const estimatedSampleDurationPicoseconds = estimatedSampleDuration * 1e9
  const estimatedExecutionsPerRun = Math.floor(estimatedSampleDurationPicoseconds / took)
  const executionsPerSample = Math.min(maxExecutionsPerSample, Math.max(estimatedExecutionsPerRun, 1))

  // Build execution handler
  const handler = createFunctionExecutionHandler(fn, executionsPerSample)

  return {
    executionsPerSample: executionsPerSample,
    handler: handler,
    failed: failed,
    took: took
  }
}

export {
  analyzeInitialFunctionExecution
}
