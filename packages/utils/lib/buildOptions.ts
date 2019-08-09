import { assign } from './assign'

/**
 * Use default options in options object.
 *
 * @param {object} options
 * @param {object[]} defaultOptions  sorted from most important to most default
 * @returns {object}
 */

function buildOptions (options: Record<any, any>, ...defaultOptions: Record<any, any>[]): object {
  // Copy object
  const finalOptions = assign({}, options)

  // Fill default values
  for (let i = 0; i < defaultOptions.length; i++) {
    const nextDefaultOptions = defaultOptions[i]

    for (const key in nextDefaultOptions) {
      if (finalOptions[key] === undefined) {
        finalOptions[key] = nextDefaultOptions[key]
      }
    }
  }

  return finalOptions
}

export {
  buildOptions
}
