/**
 * Format number to human-readable format.
 *
 * @param {number} num
 * @param {number} [fractionDigits]
 * @param {string} [unit]
 * @returns {string}
 */
function formatNumber (num: number, fractionDigits?: number, unit: string = ''): string {
  // Check if it's really a number
  if (typeof num !== 'number') {
    return '' + num + unit
  }

  // Check if it's valid number
  if (isNaN(num)) {
    return 'n/a'
  }

  // Format number
  return num
    .toFixed(fractionDigits)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + unit
}

export {
  formatNumber
}
