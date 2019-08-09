/**
 * Check if value is a correct integer number.
 *
 * @param {*} value
 * @param {number} [minimum]
 * @param {number} [maximum]
 * @param {boolean} [allowInfinity]
 * @returns {boolean}
 */
function isValidInteger (
  value: number,
  minimum: number = -Infinity,
  maximum: number = Infinity,
  allowInfinity: boolean = false
): boolean {
  // Check if it's a number
  if (typeof value !== 'number' || isNaN(value)) {
    return false
  }

  // Check if it's infinity
  const isInfinity = !isFinite(value)

  // Check type requirements
  if (!allowInfinity && isInfinity) {
    return false
  } else if (!isInfinity && Math.floor(value) !== value) {
    return false
  }

  // Check if its value is in selected range
  return value >= minimum && value <= maximum
}

export {
  isValidInteger
}
