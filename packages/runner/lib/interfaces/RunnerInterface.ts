import { EventEmitter } from 'events'
import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'
import { RunnerOptionsInterface } from './RunnerOptionsInterface'
import { CreateSessionCallbackType } from './CreateSessionCallbackType'

interface RunnerInterface {
  readonly events: EventEmitter
  readonly options: RunnerOptionsInterface

  /** Get unique ID for runner instance */
  getRunnerId (): string

  /** Get runner adapter type */
  getRunnerType (): string

  /** Get runner adapter human-readable description */
  getRunnerName (): string

  /** Initialize runner, to ensure it is ready for starting new session (i.e. ensure or install Chrome) */
  initialize (callback: (error: any | null) => any): void

  /** Create new separated session through this runner */
  createSession (fileSystem: FileSystemInterface, callback: CreateSessionCallbackType): void
}

export {
  RunnerInterface
}
