/**
 * Get minimum value of values list.
 *
 * @param {number[]} values
 * @returns {number}
 */
function getMinimum (values: number[]): number {
  let minValue = values[0]

  for (let i = 1; i < values.length; i++) {
    const nextValue = values[i]

    if (nextValue < minValue) {
      minValue = nextValue
    }
  }

  return minValue
}

export {
  getMinimum
}
