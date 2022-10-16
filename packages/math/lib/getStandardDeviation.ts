import { getAverage } from './getAverage'

/**
 * Get standard deviation of selected values.
 *
 * @param {number[]} values
 * @returns {number}
 */
function getStandardDeviation (values: number[]): number {
  // Calculate average value
  const average = getAverage(values)

  // Calculate (diffs against average)^2
  const squareDiffsSum = values.reduce((acc, value) => acc + Math.pow(value - average, 2), 0)

  // Get square root of average diff^2
  return Math.sqrt(squareDiffsSum / values.length)
}

export {
  getStandardDeviation
}
