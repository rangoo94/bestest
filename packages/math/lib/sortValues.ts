/**
 * Sort values ASC.
 *
 * @param {number[]} values
 * @returns {number[]}
 */
function sortValues (values: number[]): number[] {
  return values.sort((a, b) => a - b)
}

export {
  sortValues
}
