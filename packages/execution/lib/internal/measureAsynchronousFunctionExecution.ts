import { getTimePrecision } from '@bestest/time-measurement/lib/getTimePrecision'
import { AsynchronousFunctionExecutionOptionsInterface } from '../interfaces/AsynchronousFunctionExecutionOptionsInterface'
import { FunctionExecutionMeasurementInterface } from '../interfaces/FunctionExecutionMeasurementInterface'
import { AsynchronousTestFunctionType } from '../interfaces/AsynchronousTestFunctionType'
import { getFunctionExecutionOptions } from '../getFunctionExecutionOptions'

/**
 * Measure asynchronous function execution time.
 * This version will include information about each function execution.
 *
 * @param {Function} fn
 * @param {AsynchronousFunctionExecutionOptionsInterface|object} options
 * @param {function(FunctionExecutionMeasurementInterface)} callback
 */
function measureAsynchronousFunctionExecution (
  fn: AsynchronousTestFunctionType,
  options: Partial<AsynchronousFunctionExecutionOptionsInterface>,
  callback: (measurement: FunctionExecutionMeasurementInterface) => any
): void {
  // Populate missing default values and validate an object
  const finalOptions = getFunctionExecutionOptions(options)

  // Extract options
  const duration = finalOptions.duration
  const getCurrentTime = finalOptions.getCurrentTime
  const scheduleTask = finalOptions.scheduleTask
  const concurrentExecutions = finalOptions.maxConcurrentExecutions

  /**
   * During transpilation to ES5, `const` information is removed.
   * Because of that, `getCurrentTime` and `scheduleTask` functions are working slower (~20%).
   *
   * When we will put them in parent context, V8 will handle it correctly,
   * as these are not modified in this child context.
   */
  function runTest () {
    // Initialize result arrays
    const timeEntries: number[] = []
    const failureTimeEntries: number[] = []

    // Calculate time precision
    const timePrecision = getTimePrecision(getCurrentTime)

    // Set-up variables variables required for runtime
    let runningTasks = 0
    let finished = false
    let currentTime = getCurrentTime()

    // Set-up helper functions

    function runExecutions () {
      for (let i = runningTasks; i < concurrentExecutions; i++) {
        spawnNextTask()
      }
    }

    function spawnNextTask () {
      currentTime = getCurrentTime()
      runningTasks++
      spawnTask(currentTime)
    }

    function spawnTask (taskStartTime: number) {
      try {
        fn(
          () => finishTask(taskStartTime),
          () => failTask(taskStartTime)
        )
      } catch (error) {
        failTask(taskStartTime)
      }
    }

    function finishTask (taskStartTime: number) {
      currentTime = getCurrentTime()
      runningTasks--
      timeEntries.push(currentTime - taskStartTime)
    }

    function failTask (taskStartTime: number) {
      currentTime = getCurrentTime()
      runningTasks--
      failureTimeEntries.push(currentTime - taskStartTime)
    }

    function tick () {
      currentTime = getCurrentTime()
      finished = finished || (currentTime >= expectedEndTime)

      if (finished) {
        return end()
      }

      if (runningTasks < concurrentExecutions) {
        runExecutions()
      }

      scheduleTask(tick)
    }

    function end () {
      if (runningTasks > 0) {
        scheduleTask(tick)
        return
      }

      callback({
        timePrecision: timePrecision,
        executionsPerSample: 1,
        concurrentExecutions: concurrentExecutions,
        startTime: startTime,
        endTime: currentTime,
        took: currentTime - startTime,
        executions: {
          total: timeEntries.length + failureTimeEntries.length,
          successful: timeEntries.length,
          failed: failureTimeEntries.length
        },
        timeEntries: {
          successful: timeEntries,
          failed: failureTimeEntries
        }
      })
    }

    // Scan HR time at execution start
    const startTime = getCurrentTime()

    // Estimate test end
    const expectedEndTime = startTime + duration * 1e9

    // Run tasks
    runExecutions()
    scheduleTask(tick)
  }

  runTest()
}

export {
  measureAsynchronousFunctionExecution
}
