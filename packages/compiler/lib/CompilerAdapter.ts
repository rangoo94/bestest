import { buildOptions } from '@bestest/utils/lib/buildOptions'
import { CompilerAdapterCompileOptionsInterface } from './interfaces/CompilerAdapterCompileOptionsInterface'
import { CompilerAdapterInterface } from './interfaces/CompilerAdapterInterface'
import { CompilerCallbackType } from './interfaces/CompilerCallbackType'

/**
 * Abstract compiler adapter class,
 * which may be extended by others.
 *
 * @abstract
 * @class
 */
abstract class CompilerAdapter<OptionsType = Record<string, any>> implements CompilerAdapterInterface {
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
      (this.constructor as typeof CompilerAdapter).defaultOptions
    ) as unknown as OptionsType
  }

  /**
   * Empty compiler initializer.
   *
   * @param {function} callback
   */
  initialize (callback: (error: any | null) => any) {
    callback(null)
  }

  /**
   * Compile code for use.
   *
   * @param {CompilerAdapterCompileOptionsInterface|object} options
   * @param {function(object|null, FileSystemInterface|object|null, string[])} callback
   */
  abstract compile (options: CompilerAdapterCompileOptionsInterface, callback: CompilerCallbackType): void
}

export {
  CompilerAdapter
}
