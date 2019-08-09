import { getTimePrecision } from '@bestest/time-measurement/lib/getTimePrecision'
import { SynchronousFunctionExecutionOptionsInterface } from '../interfaces/SynchronousFunctionExecutionOptionsInterface'
import { FunctionExecutionMeasurementInterface } from '../interfaces/FunctionExecutionMeasurementInterface'
import { SynchronousTestFunctionType } from '../interfaces/SynchronousTestFunctionType'
import { getFunctionExecutionOptions } from '../getFunctionExecutionOptions'

/**
 * Measure synchronous function execution time.
 *
 * @param {Function} fn
 * @param {SynchronousFunctionExecutionOptionsInterface|object} options
 * @param {int} [executionsPerSample]
 * @returns {FunctionExecutionMeasurementInterface}
 */
function measureSynchronousFunctionExecutionWithoutDetails (
  fn: SynchronousTestFunctionType,
  options: Partial<SynchronousFunctionExecutionOptionsInterface>,
  executionsPerSample: number = 1
): FunctionExecutionMeasurementInterface {
  // Populate missing default values and validate an object
  const finalOptions = getFunctionExecutionOptions(options)

  // Extract options
  const getCurrentTime = finalOptions.getCurrentTime
  const duration = finalOptions.duration

  function runTest () {
    // Initialize variables for number of executions
    let runs = 0
    let failedRuns = 0

    // Calculate time precision
    const timePrecision = getTimePrecision(getCurrentTime) / executionsPerSample

    // Scan HR time at execution start
    const startTime = getCurrentTime()

    // Estimate test end
    const expectedEndTime = startTime + duration * 1e9

    // Initialize variables for task time estimation
    let taskStartTime: number = startTime
    let currentTime: number = startTime

    // Execute function until end time is reached
    do {
      // Measure task start time
      taskStartTime = getCurrentTime()

      // Run task
      try {
        fn()

        // Insert new information about call
        runs++
      } catch (error) {
        // Insert new information about call
        failedRuns++
      }

      // Measure task end time
      currentTime = getCurrentTime()
    } while (currentTime < expectedEndTime)

    return {
      timePrecision: timePrecision,
      executionsPerSample: executionsPerSample,
      concurrentExecutions: 1,
      startTime: startTime,
      endTime: currentTime,
      took: currentTime - startTime,
      executions: {
        total: (runs + failedRuns) * executionsPerSample,
        successful: runs * executionsPerSample,
        failed: failedRuns * executionsPerSample
      },
      timeEntries: undefined
    }
  }

  return runTest()
}

export {
  measureSynchronousFunctionExecutionWithoutDetails
}
