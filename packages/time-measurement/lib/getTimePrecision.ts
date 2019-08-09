import { getAverage } from '@bestest/math/lib/getAverage'
import { TimeGetterType } from './interfaces/TimeGetterType'

/**
 * Calculate HR time precision.
 *
 * @returns {number} precision in picoseconds
 */
function getTimePrecision (measureTimeFn: TimeGetterType): number {
  const precisions: number[] = []

  // Warm-up high resolution time function
  measureTimeFn()
  measureTimeFn()
  measureTimeFn()

  // Calculate time precision
  for (let i = 0; i < 100; i++) {
    const startTime = measureTimeFn()
    const middleTime = measureTimeFn()
    const endTime = measureTimeFn()

    // Calculate middle time
    const expectedMiddleTime = (startTime + middleTime + endTime) / 3

    // Calculate precision
    const precision = Math.abs(middleTime - expectedMiddleTime)

    // Find a difference between middle time and average of these three
    precisions.push(precision)
  }

  // It could be `getMaximum` to be more exact,
  // but average value will be better for statistical purposes.
  return getAverage(precisions)
}

export {
  getTimePrecision
}
