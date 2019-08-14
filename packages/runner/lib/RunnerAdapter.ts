import { buildOptions } from '@bestest/utils/lib/buildOptions'
import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'
import { CreateSessionCallbackType } from './interfaces/CreateSessionCallbackType'
import { RunnerAdapterInterface } from './interfaces/RunnerAdapterInterface'

/**
 * Abstract runner adapter class,
 * which may be extended by others.
 *
 * @abstract
 * @class
 */
abstract class RunnerAdapter<OptionsType = Record<string, any>> implements RunnerAdapterInterface {
  readonly options: OptionsType
  abstract readonly type: string
  abstract readonly name: string

  static defaultOptions = {}

  /**
   * @param {object} [options]
   */
  constructor (options?: Partial<OptionsType>) {
    this.options = buildOptions(
      options || {},
      (this.constructor as typeof RunnerAdapter).defaultOptions
    ) as unknown as OptionsType
  }

  /**
   * Empty runner initializer.
   *
   * @param {function(*)} callback
   */
  initialize (callback: (error: any | null) => any) {
    callback(null)
  }

  /**
   * Create new (isolated) session,
   * to execute code.
   *
   * @param {FileSystemInterface|object} fileSystem
   * @param {function(*, RunnerSessionInterface|object)} callback
   */
  abstract createSession (fileSystem: FileSystemInterface, callback: CreateSessionCallbackType): void
}

export {
  RunnerAdapter
}
