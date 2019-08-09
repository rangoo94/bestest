/**
 * Get maximum value of values list.
 *
 * @param {number[]} values
 * @returns {number}
 */
function getMaximum (values: number[]): number {
  let maxValue = values[0]

  for (let i = 1; i < values.length; i++) {
    const nextValue = values[i]

    if (nextValue > maxValue) {
      maxValue = nextValue
    }
  }

  return maxValue
}

export {
  getMaximum
}
