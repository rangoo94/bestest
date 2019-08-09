/**
 * Object.assign alternative.
 * Can be used as ponyfill.
 *
 * @param {object} target
 * @param {object[]} [objects]
 * @returns {object}
 */
function assignAlternative (target: object, ...objects: Record<any, any>[]): object {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }

  const result = Object(target)

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]

    if (object == null) {
      continue
    }

    for (const key in object) {
      if (!object.hasOwnProperty(key)) {
        continue
      }

      const descriptor = Object.getOwnPropertyDescriptor(object, key)

      if (descriptor && descriptor.enumerable) {
        result[key] = object[key]
      }
    }
  }

  return result
}

const assign = Object.assign || assignAlternative

export {
  assign
}
