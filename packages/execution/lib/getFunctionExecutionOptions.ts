import { getAvailableTimeMeasurementMethods } from '@bestest/time-measurement/lib/getAvailableTimeMeasurementMethods'
import { getAvailableTaskSchedulementMethods } from '@bestest/task-schedulement/lib/getAvailableTaskSchedulementMethods'
import { buildOptions } from '@bestest/utils/lib/buildOptions'
import { FunctionExecutionOptionsInterface } from './interfaces/FunctionExecutionOptionsInterface'
import { validateFunctionExecutionOptions } from './validateFunctionExecutionOptions'

const defaultTimeMeasurementMethod = getAvailableTimeMeasurementMethods()[0]
const defaultTaskSchedulementMethod = getAvailableTaskSchedulementMethods()[0]

const defaultOptions = {
  // Basic options
  asynchronous: false,
  includeDetails: true,
  duration: 1000, // in milliseconds
  getCurrentTime: defaultTimeMeasurementMethod ? defaultTimeMeasurementMethod.createGetter() : null, // returns time in picoseconds

  // Synchronous options
  estimatedSampleDuration: 50, // in milliseconds
  maxExecutionsPerSample: 500,

  // Asynchronous options
  maxConcurrentExecutions: 30,
  scheduleTask: defaultTaskSchedulementMethod ? defaultTaskSchedulementMethod.createScheduler() : null
}

/**
 * Build function execution options,
 * populating default values.
 *
 * It will also validate a structure to check if it has proper data.
 *
 * @param {FunctionExecutionOptionsInterface|object} options
 * @returns {FunctionExecutionOptionsInterface}
 * @throws {Error}
 */
function getFunctionExecutionOptions (options: Partial<FunctionExecutionOptionsInterface>): FunctionExecutionOptionsInterface {
  // Validate if options object is an object, null or undefined
  if (options !== undefined && typeof options !== 'object') {
    throw new Error('Invalid options passed for function execution - object expected.')
  }

  // Populate missing default values
  const finalOptions = buildOptions(options || {}, defaultOptions)

  // Validate if configuration is valid
  validateFunctionExecutionOptions(finalOptions)

  // Everything went fine, so we may assume that it's full options object now
  return finalOptions as FunctionExecutionOptionsInterface
}

export {
  getFunctionExecutionOptions
}
