import { getTimePrecision } from '@bestest/time-measurement/lib/getTimePrecision'
import { SynchronousFunctionExecutionOptionsInterface } from '../interfaces/SynchronousFunctionExecutionOptionsInterface'
import { FunctionExecutionMeasurementInterface } from '../interfaces/FunctionExecutionMeasurementInterface'
import { SynchronousTestFunctionType } from '../interfaces/SynchronousTestFunctionType'
import { getFunctionExecutionOptions } from '../getFunctionExecutionOptions'

/**
 * Measure synchronous function execution time.
 * This version will include information about each function execution.
 *
 * @param {Function} fn
 * @param {SynchronousFunctionExecutionOptionsInterface|object} options
 * @param {int} [executionsPerSample]
 * @returns {FunctionExecutionMeasurementInterface}
 */
function measureSynchronousFunctionExecution (
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
    // Initialize result arrays
    const timeEntries = []
    const failureTimeEntries = []

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

        // Measure task end time
        currentTime = getCurrentTime()

        // Insert new information about call
        timeEntries.push(~~((currentTime - taskStartTime) / executionsPerSample))
      } catch (error) {
        // Measure task end time
        currentTime = getCurrentTime()

        // Insert new information about call
        failureTimeEntries.push(~~((currentTime - taskStartTime) / executionsPerSample))
      }
    } while (currentTime < expectedEndTime)

    // Accumulate data
    const successfulExecutions = timeEntries.length * executionsPerSample
    const failedExecutions = failureTimeEntries.length * executionsPerSample

    return {
      timePrecision: timePrecision,
      executionsPerSample: executionsPerSample,
      concurrentExecutions: 1,
      startTime: startTime,
      endTime: currentTime,
      took: currentTime - startTime,
      executions: {
        total: successfulExecutions + failedExecutions,
        successful: successfulExecutions,
        failed: failedExecutions
      },
      timeEntries: {
        successful: timeEntries,
        failed: failureTimeEntries
      }
    }
  }

  return runTest()
}

export {
  measureSynchronousFunctionExecution
}
