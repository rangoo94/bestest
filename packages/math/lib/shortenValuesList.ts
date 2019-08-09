import { getAverage } from './getAverage'

/**
 * Shorten values list
 *
 * @param {number} expectedLength
 * @param {number[]} values
 * @returns {number[]}
 */
function shortenValuesList (expectedLength: number, values: number[]): number[] {
  // Prepare array for final values
  const result = []

  // Calculate step for moving forward
  const step = Math.ceil(values.length / expectedLength)

  // Iterate over values
  for (let i = 0; i < values.length; i += step) {
    const startIndex = Math.floor(i)
    const endIndex = Math.ceil(i + step)
    const range = values.slice(startIndex, endIndex)
    const averageRangeValue = getAverage(range)

    result.push(averageRangeValue)
  }

  return result
}

export {
  shortenValuesList
}
