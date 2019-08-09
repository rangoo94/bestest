import { CustomTaskSchedulement } from './CustomTaskSchedulement'
import { TaskSchedulementInterface } from './interfaces/TaskSchedulementInterface'

/**
 * Definition of queueMicrotask() task scheduler.
 * It is new API, which allows to queue task on V8 routine.
 *
 * It's available both in browser and in Node.js environment.
 *
 * Warning: using microtask-only queue may cause problems with macrotasks & timers!
 */
const queueMicrotaskMethod = new CustomTaskSchedulement({
  id: 'microtask',
  name: 'queueMicrotask',
  check: () => typeof queueMicrotask === 'function',
  factory: () => queueMicrotask
})

/**
 * Definition of queueMicrotask() mixed with setImmediate() task scheduler.
 * It is using microtask queue, but to ensure proper timers & macrotasks,
 * it's emitting setImmediate macrotask from time to time.
 *
 * It's available only in Node.js environment.
 *
 * There is 'new Function' created to gain better performance,
 * than it could be possible through regular code.
 */
const queueMicrotaskWithSetImmediateMethod = new CustomTaskSchedulement({
  id: 'microtask-immediate',
  name: 'queueMicrotask (mixed with setImmediate)',
  check: () => typeof queueMicrotask === 'function' && typeof setImmediate === 'function',
  factory: () => {
    const microtasksLimit = 7

    return new Function('tick', 'immediate', `
      var counter = 0;
      return function (fn) {
        if (counter++ % ${microtasksLimit} !== 0) {
          tick(fn)
        } else {
          immediate(fn)
        }
      }
    `)(queueMicrotask, setImmediate) as (fn: (...args: any) => any) => any
  }
})

/**
 * Definition of queueMicrotask() mixed with setTimeout() task scheduler.
 * It is using microtask queue, but to ensure proper timers & macrotasks,
 * it's emitting setTimeout timer from time to time.
 *
 * It's available both in browser and in Node.js environment.
 *
 * There is 'new Function' created to gain better performance,
 * than it could be possible through regular code.
 */
const queueMicrotaskWithSetTimeoutMethod = new CustomTaskSchedulement({
  id: 'microtask-timeout',
  name: 'queueMicrotask (mixed with setTimeout)',
  check: () => typeof queueMicrotask === 'function' && typeof setImmediate === 'function',
  factory: () => {
    const microtasksLimit = 750

    return new Function('tick', 'timeout', `
      var counter = 0;
      return function (fn) {
        if (counter++ % ${microtasksLimit} !== 0) {
          tick(fn)
        } else {
          timeout(fn)
        }
      }
    `)(queueMicrotask, setTimeout) as (fn: (...args: any) => any) => any
  }
})

/**
 * Definition of [script injection] task scheduler.
 * It will attach new <script> element to document' body.
 *
 * It's available only in browser environment.
 */
const scriptInjectionMethod = new CustomTaskSchedulement({
  id: 'script-injection',
  name: '<script> injection',
  check: () => typeof window === 'object' && typeof document === 'object',
  factory: () => {
    let counter = 0

    const doc = document
    const body = doc.body
    const randomId = '$$injectedScript$$'
    const randomName = '$$queuedTask$$'

    return () => {
      counter++

      const id = randomId + counter
      const name = randomName + counter

      const code =
        `var win = window, doc = document;` +
        `doc.body.removeChild(doc.getElementById("${id}"));` +
        `var task = win.${name};` +
        `delete win.${name};` +
        `task()`

      const script = doc.createElement('script')
      script.id = id
      script.innerHTML = code
      body.appendChild(script)
    }
  }
})

/**
 * Definition of process.nextTick() task scheduler.
 * It is using microtask queue, through Node.js event loop.
 *
 * It's available only in Node.js environment.
 *
 * Warning: using microtask-only queue may cause problems with macrotasks & timers!
 */
const nextTickMethod = new CustomTaskSchedulement({
  id: 'tick',
  name: 'process.nextTick',
  // Node <= 0.10 has different process.nextTick implementation, which doesn't work recursively.
  // @ts-ignore
  check: () => typeof process === 'object' && typeof process.nextTick === 'function' && !process.maxTickDepth,
  factory: () => process.nextTick
})

/**
 * Definition of process.nextTick() mixed with setImmediate() task scheduler.
 * It is using microtask queue, but to ensure proper timers & macrotasks,
 * it's emitting setImmediate macrotask from time to time.
 *
 * It's available only in Node.js environment.
 *
 * There is 'new Function' created to gain better performance,
 * than it could be possible through regular code.
 */
const nextTickWithSetImmediateMethod = new CustomTaskSchedulement({
  id: 'tick-immediate',
  name: 'process.nextTick (mixed with setImmediate)',
  // Node <= 0.10 has different process.nextTick implementation, which doesn't work recursively.
  // @ts-ignore
  check: () => typeof process === 'object' && typeof process.nextTick === 'function' && typeof setImmediate === 'function' && !process.maxTickDepth,
  factory: () => {
    // @ts-ignore
    const limit = process.maxTickDepth / 2 || 500

    return new Function('tick', 'immediate', `
      var counter = 0;
      return function (fn) {
        if (counter++ % ${limit} !== 0) {
          tick(fn)
        } else {
          immediate(fn)
        }
      }
    `)(process.nextTick, setImmediate) as (fn: (...args: any) => any) => any
  }
})

/**
 * Definition of process.nextTick() mixed with setTimeout() task scheduler.
 * It is using microtask queue, but to ensure proper timers & macrotasks,
 * it's emitting setTimeout timer from time to time.
 *
 * It's available only in Node.js environment.
 *
 * There is 'new Function' created to gain better performance,
 * than it could be possible through regular code.
 */
const nextTickWithSetTimeoutMethod = new CustomTaskSchedulement({
  id: 'tick-timeout',
  name: 'process.nextTick (mixed with setTimeout)',
  // Node <= 0.10 has different process.nextTick implementation, which doesn't work recursively.
  // @ts-ignore
  check: () => typeof process === 'object' && typeof process.nextTick === 'function' && typeof setImmediate === 'function' && !process.maxTickDepth,
  factory: () => {
    // @ts-ignore
    const limit = process.maxTickDepth / 2 || 500

    return new Function('tick', 'timeout', `
      var counter = 0;
      return function (fn) {
        if (counter++ % ${limit} !== 0) {
          tick(fn)
        } else {
          timeout(fn)
        }
      }
    `)(process.nextTick, setTimeout) as (fn: (...args: any) => any) => any
  }
})

/**
 * Definition of setImmediate() task scheduler.
 * It is scheduling macrotask, in Node.js event loop.
 *
 * It's available only in Node.js environment.
 */
const setImmediateMethod = new CustomTaskSchedulement({
  id: 'immediate',
  name: 'setImmediate',
  check: () => typeof setImmediate === 'function',
  factory: () => setImmediate
})

/**
 * Definition of setImmediate() task scheduler.
 * It is scheduling task through timer, in Node.js event loop.
 *
 * It's available only in Node.js environment.
 */
const setTimeoutMethod = new CustomTaskSchedulement({
  id: 'timeout',
  name: 'setTimeout',
  check: () => typeof setTimeout === 'function',
  factory: () => setTimeout
})

/**
 * Definition of Promise.resolve().then(fn) task scheduler.
 * It is scheduling microtask as a resolved promise effect.
 *
 * It's available both in browser and Node.js environment.
 *
 * Warning: using microtask-only queue may cause problems with macrotasks & timers!
 */
const promiseResolveMethod = new CustomTaskSchedulement({
  id: 'promise',
  name: 'Promise.resolve',
  check: () => typeof Promise === 'function' && typeof Promise.resolve === 'function',
  factory: () => {
    const promise = Promise.resolve()
    return fn => promise.then(fn)
  }
})

/**
 * Definition of MessageChannel task scheduler.
 * It is scheduling microtask as a part of postMessage mechanism.
 *
 * It's available only in browser environment.
 *
 * Warning: using microtask-only queue may cause problems with macrotasks & timers!
 * TODO: Check if it's not a macrotask
 */
const messageChannelMethod = new CustomTaskSchedulement({
  id: 'message-channel',
  name: 'MessageChannel',
  check: () => typeof MessageChannel === 'function',
  factory: () => {
    const channel = new MessageChannel()
    const port1 = channel.port1
    const post = channel.port2.postMessage.bind(channel.port2)

    return fn => {
      port1.onmessage = fn
      post(0)
    }
  }
})

const taskSchedulementMethods: TaskSchedulementInterface[] = [
  // Micro/macro tasks mixed
  nextTickWithSetImmediateMethod,
  queueMicrotaskWithSetImmediateMethod,

  // Macrotasks, most stable
  setImmediateMethod,

  // Slower micro/macro tasks mixed
  nextTickWithSetTimeoutMethod,
  queueMicrotaskWithSetTimeoutMethod,

  // Slower options
  setTimeoutMethod,
  scriptInjectionMethod,

  // Microtasks - be careful!
  // These will block macrotasks from execution.
  nextTickMethod,
  queueMicrotaskMethod,
  promiseResolveMethod,
  messageChannelMethod
]

export {
  queueMicrotaskMethod,
  queueMicrotaskWithSetImmediateMethod,
  queueMicrotaskWithSetTimeoutMethod,
  scriptInjectionMethod,
  nextTickMethod,
  nextTickWithSetImmediateMethod,
  nextTickWithSetTimeoutMethod,
  setImmediateMethod,
  setTimeoutMethod,
  promiseResolveMethod,
  messageChannelMethod,
  taskSchedulementMethods
}
