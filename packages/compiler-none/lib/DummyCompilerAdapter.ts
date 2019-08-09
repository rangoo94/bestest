import { CompilerAdapterCompileOptionsInterface } from '@bestest/compiler/lib/interfaces/CompilerAdapterCompileOptionsInterface'
import { CompilerCallbackType } from '@bestest/compiler/lib/interfaces/CompilerCallbackType'
import { CompilerAdapter } from '@bestest/compiler/lib/CompilerAdapter'

/**
 * Bestest Compiler adapter, which is completely transparent.
 * Used to always keep the same behavior, even if no compilation process is required.
 *
 * @class
 */
class DummyCompilerAdapter extends CompilerAdapter {
  readonly type = '@bestest/compiler-none'
  readonly name = 'None'

  /**
   * Compile code for use.
   *
   * @param {CompilerAdapterCompileOptionsInterface|object} options
   * @param {function(object|null, FileSystemInterface|object|null, string[])} callback
   */
  compile (options: CompilerAdapterCompileOptionsInterface, callback: CompilerCallbackType): void {
    callback(null, options.fs, options.entries)
  }
}

export {
  DummyCompilerAdapter
}
