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
  const squareDiffs = values.map(value => Math.pow(value - average, 2))

  // Get average diff^2
  const averageSquareDiff = getAverage(squareDiffs)

  // Get square root of average diff^2
  return Math.sqrt(averageSquareDiff)
}

export {
  getStandardDeviation
}
