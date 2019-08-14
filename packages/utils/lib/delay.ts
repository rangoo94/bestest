import { createDelayedFunction } from './createDelayedFunction'

/**
 * Delay function execution.
 *
 * @param {function} fn
 * @param {Array} args
 */
function delay<ArgsType extends any[]> (fn: (...args: ArgsType) => any, ...args: ArgsType): void {
  createDelayedFunction(fn)(...args)
}

export {
  delay
}
