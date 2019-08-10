import { CompilerAdapterCompileOptionsInterface } from './CompilerAdapterCompileOptionsInterface'
import { CompilerCallbackType } from './CompilerCallbackType'

interface CompilerAdapterInterface {
  /** Compiler adapter type */
  readonly type: string

  /** Compiler adapter human-readable description */
  readonly name: string

  /** Initialize compiler, to ensure it is ready for compilation */
  initialize (callback: (error: any | null) => any): void

  /** Compile passed files */
  compile (options: Partial<CompilerAdapterCompileOptionsInterface>, callback: CompilerCallbackType): void
}

export {
  CompilerAdapterInterface
}
