/**
 * Get sum of values.
 *
 * @param {number[]} values
 * @returns {number}
 */
function getSum (values: number[]): number {
  return values.reduce((acc, next) => acc + next, 0)
}

export {
  getSum
}
