import * as StackTrace from 'stacktrace-js'
import { StackTraceFrameInterface } from './interfaces/StackTraceFrameInterface'

/**
 * Get current stack trace.
 *
 * @param {string[]} omittedFunctionNames
 * @returns {StackTraceFrameInterface[]|object[]}
 */
function getStackTrace (omittedFunctionNames: string[] = []): StackTraceFrameInterface[] {
  // Get current stack trace
  const stackTrace = StackTrace.getSync()

  // Set initial start index (omitting `getStackTrace` function frame)
  let startIndex = 1

  // Iterate over functions to remove internals
  for (let i = startIndex; i < stackTrace.length; i++) {
    if (omittedFunctionNames.indexOf(stackTrace[i]?.functionName!) !== -1) {
      startIndex = i + 1
    }
  }

  // Return back stack trace, ignoring internal frames
  return (stackTrace as any).slice(startIndex)
}

export {
  getStackTrace
}
