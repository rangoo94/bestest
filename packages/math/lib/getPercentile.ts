// @ts-ignore: missing declarations
import quickSelect = require('quickselect')

/**
 * Select expected percentile from values array.
 *
 * @param {number} percentile
 * @param {number[]} values
 * @param {boolean} [isSorted]
 * @returns {number}
 */
function getPercentile (percentile: number, values: number[], isSorted: boolean = false): number {
  // Calculate index
  const index = getPercentileIndex(percentile, values)

  // Sort array, if it's not sorted yet (ASC)
  if (isSorted) {
    return +values[index]
  }

  // Get proper percentile
  quickSelect(values, index)
  return +values[index]
}

/**
 * Get index of selected percentile.
 *
 * @param {number} percentile
 * @param {number[]} values
 * @returns {number}
 */
function getPercentileIndex (percentile: number, values: number[]): number {
  // Validate percentile
  if (percentile < 0 || isNaN(percentile)) {
    throw new Error('Percentile should not be lower than 0.')
  }

  // Calculate index
  const index = Math.round(percentile * values.length / 100)

  // Ensure that it will be within array
  return Math.min(index, values.length - 1)
}

export {
  getPercentile,
  getPercentileIndex
}
