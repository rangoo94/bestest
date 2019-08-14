// Select possible options for delay
const nextTick = typeof process === 'object' && typeof process.nextTick === 'function' ? process.nextTick : null
const microtask = typeof queueMicrotask === 'function' ? queueMicrotask : null
const timeout = typeof setTimeout === 'function' ? setTimeout : null

// Choose most proper method
const method = (nextTick || microtask || timeout) as (fn: Function) => any

/**
 * Delay function execution.
 *
 * @param {function} fn
 */
function createDelayedFunction<T extends Function> (fn: T): T {
  return ((...args: any[]) => method(() => fn(...args))) as any
}

export {
  createDelayedFunction
}
