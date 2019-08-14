import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'
import { CreateSessionCallbackType } from './CreateSessionCallbackType'

interface RunnerAdapterInterface {
  /** Runner adapter type */
  readonly type: string

  /** Runner adapter human-readable description */
  readonly name: string

  /** Initialize runner, to ensure it is ready for starting new session (i.e. ensure or install Chrome) */
  initialize (callback: (error: any | null) => any): void

  /** Create new separated session through this runner */
  createSession (fileSystem: FileSystemInterface, callback: CreateSessionCallbackType): void
}

export {
  RunnerAdapterInterface
}
