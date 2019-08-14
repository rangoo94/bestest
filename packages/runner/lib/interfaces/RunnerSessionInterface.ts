import { EventEmitter } from 'events'

interface RunnerSessionInterface {
  readonly events: EventEmitter

  /** Check if session is available (not destroyed) */
  isActive (): boolean

  /** Execute inline script */
  executeScript (
    fnWithinSessionContext: (done: (result?: any) => any) => any,
    callback: (error: any | null, result?: any) => any
  ): void

  /** Include file from file system passed in constructor */
  includeFile (
    filePath: string,
    callback: (error: any | null) => any
  ): void

  /** Destroy current session, as it will no longer be used */
  destroy (callback?: (error: any | null) => any): void
}

export {
  RunnerSessionInterface
}
