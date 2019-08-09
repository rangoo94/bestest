import { getAverage } from './getAverage'

/**
 * Get sample standard deviation of selected values.
 *
 * @param {number[]} values
 * @returns {number}
 */
function getSampleStandardDeviation (values: number[]): number {
  // Calculate average value
  const average = getAverage(values)

  // Calculate (diffs against average)^2 sum
  let squareDiffsSum = 0
  for (let i = 0; i < values.length; i++) {
    squareDiffsSum += Math.pow(values[i] - average, 2)
  }

  // Get diff^2 variance
  const averageVariance = squareDiffsSum / (values.length - 1)

  // Get square root of average diff^2
  return Math.sqrt(averageVariance)
}

export {
  getSampleStandardDeviation
}
