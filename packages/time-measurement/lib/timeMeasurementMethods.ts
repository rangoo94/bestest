import { TimeMeasurementInterface } from './interfaces/TimeMeasurementInterface'
import { CustomTimeMeasurement } from './CustomTimeMeasurement'

/**
 * Definition of process.hrtime() measurement method.
 *
 * Only for Node.js.
 */
const processHrTimeMethod = new CustomTimeMeasurement({
  id: 'hrtime',
  name: 'process.hrtime',
  check: () => typeof process !== 'undefined' && typeof process.hrtime === 'function',
  factory: () => {
    const hrtime = process.hrtime

    return () => {
      const [ seconds, nanoseconds ] = hrtime()
      return seconds * 1e12 + nanoseconds * 1e3
    }
  }
})

/**
 * Get performance.now implementation,
 * based on environment.
 *
 * It will either use public Performance API,
 * or it will load get it from 'perf_hooks' native Node.js module.
 *
 * @returns {function(): number}
 */
function getPerformanceNowFunction (): (() => number) | null {
  // Check browser API
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now.bind(performance)
  }

  // Check Node.js API
  try {
    const now = require('perf_' + 'hooks').performance.now

    if (typeof now === 'function') {
      return now
    }
  } catch (e) {}

  // Nothing found
  return null
}

/**
 * Definition of performance.now() measurement method.
 *
 * Either uses browser' Performance API,
 * or perf_hooks in Node.js.
 */
const performanceNowMethod = new CustomTimeMeasurement({
  id: 'performance',
  name: 'performance.now',
  check: () => !!getPerformanceNowFunction(),
  factory: () => {
    const now = getPerformanceNowFunction() as () => number
    return () => now() * 1e9
  }
})

/**
 * Definition of Date.now() measurement method.
 *
 * It may result in incorrect values (even below 0).
 */
const dateNowMethod = new CustomTimeMeasurement({
  id: 'date',
  name: 'Date.now',
  check: () => typeof Date !== 'undefined' && typeof Date.now === 'function',
  factory: () => {
    const now = Date.now
    return () => now() * 1e9
  }
})

/**
 * Definition of new Date().getTime() measurement method.
 *
 * It may result in incorrect values (even below 0).
 */
const dateMethod = new CustomTimeMeasurement({
  id: 'date-instance',
  name: 'new Date.getTime',
  check: () => typeof Date !== 'undefined',
  factory: () => {
    const now = Date.now
    return () => now() * 1e9
  }
})

const timeMeasurementMethods: TimeMeasurementInterface[] = [
  processHrTimeMethod,
  performanceNowMethod,
  dateNowMethod,
  dateMethod
]

export {
  processHrTimeMethod,
  performanceNowMethod,
  dateNowMethod,
  dateMethod,
  timeMeasurementMethods
}
