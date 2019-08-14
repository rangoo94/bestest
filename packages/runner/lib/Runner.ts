import { EventEmitter } from 'events'
import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'
import { createDelayedFunction } from '@bestest/utils/lib/createDelayedFunction'
import { buildOptions } from '@bestest/utils/lib/buildOptions'
import { RunnerInterface } from './interfaces/RunnerInterface'
import { RunnerOptionsInterface } from './interfaces/RunnerOptionsInterface'
import { RunnerAdapterInterface } from './interfaces/RunnerAdapterInterface'
import { RunnerSessionInterface } from './interfaces/RunnerSessionInterface'
import { CreateSessionCallbackType } from './interfaces/CreateSessionCallbackType'

class Runner implements RunnerInterface {
  readonly options: RunnerOptionsInterface
  readonly adapter: RunnerAdapterInterface
  readonly events: EventEmitter
  private readonly _id: string

  static defaultOptions = {

  }

  constructor (id: string | null, adapter: RunnerAdapterInterface, options?: Partial<RunnerOptionsInterface>) {
    // Attach passed adapter
    // TODO: CHECK IF VALID ADAPTER IS PASSED
    this.adapter = adapter

    // Build runner options using defaults
    this.options = buildOptions(options || {}, (this.constructor as typeof Runner).defaultOptions)

    // Populate private ID field
    this._id = id == null ? '<unknown>' : id

    // Validate passed ID
    if (typeof this._id !== 'string') {
      throw new Error('Invalid ID passed for runner.')
    }

    // Initialize event-emitter
    this.events = new EventEmitter()
  }

  /**
   * Get ID of current runner instance.
   *
   * @returns {string}
   */
  getRunnerId (): string {
    return this._id
  }

  /**
   * Get runner adapter type.
   *
   * @returns {string}
   */
  getRunnerType (): string {
    return this.adapter.type
  }

  /**
   * Get human-readable runner name.
   *
   * @returns {string}
   */
  getRunnerName (): string {
    return this.adapter.name
  }

  /**
   * Initialize adapter,
   * so it will be ready for creating new sessions.
   *
   * @param {function(*)} callback
   */
  initialize (callback: (error: any | null) => any): void {
    // Delay functions, to ensure that their errors will not affect the flow
    const emit = createDelayedFunction(this.events.emit.bind(this.events))
    const call = createDelayedFunction(callback)

    // Inform about initialization process started
    emit('initialize:start')

    // Emit result back
    const onFinish = (error: any | null) => {
      emit('initialize:end', error)
      emit(error === null ? 'initialize:success' : 'initialize:error', error)

      call(error || null)
    }

    // Handle synchronous errors and initialize adapter
    try {
      this.adapter.initialize(onFinish)
    } catch (error) {
      onFinish(error || new Error())
    }
  }

  /**
   * Create new (isolated) running session,
   * which can execute code in its space.
   *
   * @param {FileSystemInterface|object} fileSystem
   * @param {function(*, RunnerSessionInterface|object)} callback
   */
  createSession (fileSystem: FileSystemInterface, callback: CreateSessionCallbackType): void {
    // Delay functions, to ensure that their errors will not affect the flow
    const emit = createDelayedFunction(this.events.emit.bind(this.events))
    const call = createDelayedFunction(callback)

    // Validate file system
    // TODO: Think if fileSystem should be really required? Couldn't be empty MemoryFs by default?
    if (!fileSystem || !fileSystem.fs) {
      throw new Error('Invalid fileSystem passed for runner session creation.')
    }

    // Emit information about session creation started
    emit('create-session:start')

    // Handle result
    const onFinish = (error: any | null, session: RunnerSessionInterface | null) => {
      emit('create-session:end', { session, error })

      if (error === null) {
        emit('create-session:success', session)
      } else {
        emit('create-session:error', error)
      }

      call(error || null, session || null)
    }

    // Handle synchronous errors and create session through adapter
    try {
      this.adapter.createSession(fileSystem, onFinish)
    } catch (error) {
      onFinish(error || new Error(), null)
    }
  }
}

export {
  Runner
}
