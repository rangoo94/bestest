import { getSum } from './getSum'

/**
 * Get average value of values.
 *
 * @param {number[]} values
 * @returns {number}
 */
function getAverage (values: number[]): number {
  return getSum(values) / values.length
}

export {
  getAverage
}
