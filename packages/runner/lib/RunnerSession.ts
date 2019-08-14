import { EventEmitter } from 'events'
import { delay } from '@bestest/utils/lib/delay'
import { buildOptions } from '@bestest/utils/lib/buildOptions'
import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'
import { RunnerSessionInterface } from './interfaces/RunnerSessionInterface'

/**
 * Abstract runner session class,
 * which may be extended by others.
 *
 * @abstract
 * @class
 */
abstract class RunnerSession<OptionsType = Record<string, any>> implements RunnerSessionInterface {
  readonly options: OptionsType
  readonly events: EventEmitter
  protected _destroyed: boolean
  protected _fs: FileSystemInterface

  static defaultOptions = {}

  /**
   * @param {FileSystemInterface|object} fileSystem
   * @param {object} [options]
   */
  constructor (fileSystem: FileSystemInterface, options?: Partial<OptionsType>) {
    this.options = buildOptions(
      options || {},
      (this.constructor as typeof RunnerSession).defaultOptions
    ) as unknown as OptionsType

    // Mark as not destroyed
    this._destroyed = false

    // Save file system reference
    this._fs = fileSystem

    // Create event emitter
    this.events = new EventEmitter()
  }

  /**
   * Check if this session is still valid.
   *
   * @returns {boolean}
   */
  isActive (): boolean {
    return this._destroyed
  }

  /**
   * Empty destroy callback,
   * which will not do anything.
   *
   * @param {function(*)} callback
   */
  destroy (callback?: (error: any | null) => any): void {
    this._destroyed = true

    delay(this.events.emit.bind(this.events), 'destroy')

    if (callback) {
      callback(null)
    }
  }

  /**
   * Execute script within session context.
   *
   * @param {function(function(*))} fnWithinSessionContext
   * @param {function(*, *)} callback
   */
  abstract executeScript (
    fnWithinSessionContext: (done: (result?: any) => any) => any,
    callback: (error: (any | null), result?: any) => any
  ): void

  /**
   * Include and execute (require) file within session context.
   *
   * @param {string} filePath
   * @param {function(*)} callback
   */
  abstract includeFile (filePath: string, callback: (error: any | null) => any): void
}

export {
  RunnerSession
}
