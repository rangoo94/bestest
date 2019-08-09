/**
 * Format duration to human-readable value.
 *
 * @param {number} picoseconds
 * @param {number} [fractionDigits]
 * @returns {string}
 */
function formatDuration (picoseconds: number, fractionDigits: number = 2): string {
  if (isNaN(picoseconds)) {
    return 'n/a'
  }

  if (picoseconds >= 1e12) {
    return (picoseconds / 1e12).toFixed(fractionDigits) + 's'
  }

  if (picoseconds >= 1e9) {
    return (picoseconds / 1e9).toFixed(fractionDigits) + 'ms'
  }

  if (picoseconds >= 1e6) {
    return (picoseconds / 1e6).toFixed(fractionDigits) + 'μs'
  }

  if (picoseconds >= 1e3) {
    return (picoseconds / 1e3).toFixed(fractionDigits) + 'ns'
  }

  return picoseconds.toFixed(fractionDigits) + 'ps'
}

export {
  formatDuration
}
