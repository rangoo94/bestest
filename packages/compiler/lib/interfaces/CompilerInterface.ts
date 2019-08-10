import { EventEmitter } from 'events'
import { CompilerOptionsInterface } from './CompilerOptionsInterface'
import { CompilerCompileOptionsInterface } from './CompilerCompileOptionsInterface'
import { CompilerCallbackType } from './CompilerCallbackType'

interface CompilerInterface {
  readonly events: EventEmitter
  readonly options: CompilerOptionsInterface

  /** Get unique ID for compiler instance */
  getCompilerId (): string

  /** Get compiler adapter type */
  getCompilerType (): string

  /** Get compiler adapter human-readable description */
  getCompilerName (): string

  /** Initialize compiler, to ensure it is ready for compilation */
  initialize (callback: (error: any | null) => any): void

  /** Compile passed files */
  compile (options: Partial<CompilerCompileOptionsInterface>, callback: CompilerCallbackType): void
}

export {
  CompilerInterface
}
