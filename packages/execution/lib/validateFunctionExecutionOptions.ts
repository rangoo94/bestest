import { isValidInteger } from '@bestest/math/lib/isValidInteger'

/**
 * Validate if passed options object,
 * could be used as function execution options object.
 *
 * It will throw errors if incorrect data are passed.
 *
 * @param {object} options
 * @throws {Error}
 */
function validateFunctionExecutionOptions (options: Record<string, any>): void {
  if (typeof options.asynchronous !== 'boolean') {
    throw new Error('Invalid `asynchronous` option passed for function execution - expected boolean.')
  }

  if (typeof options.includeDetails !== 'boolean') {
    throw new Error('Invalid `includeDetails` option passed for function execution - expected boolean.')
  }

  if (!isValidInteger(options.duration, 50)) {
    throw new Error('Invalid `duration` option passed for function execution - expected integer >= 50. (in milliseconds)')
  }

  if (!isValidInteger(options.maxExecutionsPerSample,1, Infinity, true)) {
    throw new Error('Invalid `maxExecutionsPerSample` option passed for function execution - expected integer >= 1 or Infinity.')
  }

  if (!isValidInteger(options.estimatedSampleDuration,1)) {
    throw new Error('Invalid `estimatedSampleDuration` option passed for function execution - expected integer >= 1. (in milliseconds)')
  }

  if (typeof options.scheduleTask !== 'function') {
    throw new Error('Invalid `scheduleTask` option passed for function execution - expected a function to schedule async task.')
  }

  if (typeof options.getCurrentTime !== 'function') {
    throw new Error('Invalid `getCurrentTime` option passed for function execution - expected a function which returns current time. (in picoseconds)')
  }
}

export {
  validateFunctionExecutionOptions
}
