import * as path from 'path'
import { EventEmitter } from 'events'
import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'
import { FileSystem } from '@bestest/fs/lib/FileSystem'
import { createDelayedFunction } from '@bestest/utils/lib/createDelayedFunction'
import { buildOptions } from '@bestest/utils/lib/buildOptions'
import { assign } from '@bestest/utils/lib/assign'
import { CompilerAdapterCompileOptionsInterface } from './interfaces/CompilerAdapterCompileOptionsInterface'
import { CompilerCompileOptionsInterface } from './interfaces/CompilerCompileOptionsInterface'
import { CompilerCompileErrorInterface } from './interfaces/CompilerCompileErrorInterface'
import { CompilerAdapterInterface } from './interfaces/CompilerAdapterInterface'
import { CompilerOptionsInterface } from './interfaces/CompilerOptionsInterface'
import { CompilerCallbackType } from './interfaces/CompilerCallbackType'
import { CompilerInterface } from './interfaces/CompilerInterface'

/**
 * Class which handle and unifies compilation process.
 *
 * @class
 */
class Compiler implements CompilerInterface {
  readonly options: CompilerOptionsInterface
  readonly adapter: CompilerAdapterInterface
  readonly events: EventEmitter
  private readonly _id: string

  static defaultOptions = {

  }

  /**
   * TODO: CHECK IF VALID ADAPTER IS PASSED
   *
   * @param {string|null} id
   * @param {CompilerAdapterInterface} adapter
   * @param {CompilerOptionsInterface|object} [options]
   */
  constructor (id: string | null, adapter: CompilerAdapterInterface, options?: Partial<CompilerOptionsInterface>) {
    // Attach passed adapter
    this.adapter = adapter

    // Build compiler options using defaults
    this.options = buildOptions(options || {}, (this.constructor as typeof Compiler).defaultOptions)

    // Populate private ID field
    this._id = id == null ? '<unknown>' : id

    // Validate passed ID
    if (typeof this._id !== 'string') {
      throw new Error('Invalid ID passed for compiler.')
    }

    // Initialize event-emitter
    this.events = new EventEmitter()
  }

  /**
   * Get ID of current compiler instance.
   *
   * @returns {string}
   */
  getCompilerId (): string {
    return this._id
  }

  /**
   * Get compiler adapter type.
   *
   * @returns {string}
   */
  getCompilerType (): string {
    return this.adapter.type
  }

  /**
   * Get human-readable compiler name.
   *
   * @returns {string}
   */
  getCompilerName (): string {
    return this.adapter.name
  }

  /**
   * Initialize compiler adapter.
   *
   * @param {function(object|null)} callback
   */
  initialize (callback: (error: any | null) => any) {
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
   * Start compilation process, using existing adapter.
   *
   * @param {CompilerCompileOptionsInterface|object} options
   * @param {function(object|null, object|null, string[])} callback
   * @param callback
   */
  compile (options: Partial<CompilerCompileOptionsInterface>, callback: CompilerCallbackType) {
    // Delay functions, to ensure that their errors will not affect the flow
    const emit = createDelayedFunction(this.events.emit.bind(this.events))
    const call = createDelayedFunction(callback)

    // Validate callback
    if (typeof callback !== 'function') {
      throw new Error('Invalid callback passed for Compiler.compile.')
    }

    // Validate and complete compilation options
    const finalOptions = this._buildCompilationOptions(options)

    // Get compiler meta-data, emitted with events
    const compiler = {
      id: this.getCompilerId(),
      type: this.getCompilerType(),
      name: this.getCompilerName(),
      options: this.options
    }

    // Set-up adapter compilation options
    const adapterCompileOptions: CompilerAdapterCompileOptionsInterface = {
      rootDirectory: finalOptions.rootDirectory,
      files: finalOptions.files,
      entries: finalOptions.entries,
      fs: this._createFileSystem(finalOptions)
    }

    // Emit 'start' event
    emit('compile:start', { compiler, options: finalOptions })

    // Wrap callback, to emit finish events
    const onFinish: CompilerCallbackType = (
      error: CompilerCompileErrorInterface | null,
      fs: FileSystemInterface | null,
      entries: string[] | null
    ) => {
      emit('compile:end', { compiler, error, fs, entries })
      emit(error === null ? 'compile:success' : 'compile:error', { compiler, error, fs, entries })

      call(error, fs, entries)
    }

    // Handle synchronous errors in adapter compilation process
    try {
      this.adapter.compile(adapterCompileOptions, onFinish)
    } catch (error) {
      onFinish({ error: error || new Error(), filePath: null, details: null }, null, null)
    }
  }

  /**
   * Create file system for current compilation.
   *
   * @param {CompilerCompileOptionsInterface|object} compilationOptions
   * @returns {FileSystemInterface}
   * @private
   */
  private _createFileSystem (compilationOptions: CompilerCompileOptionsInterface): FileSystemInterface {
    // Initialize empty file system
    const fs = new FileSystem({
      useHostFileSystem: compilationOptions.useHostFileSystem,
      rootDirectory: compilationOptions.rootDirectory
    })

    // Get memory files
    const memoryFiles = compilationOptions.memoryFiles || []

    // Insert all passed files
    for (let i = 0; i < memoryFiles.length; i++) {
      const file = memoryFiles[i]
      fs.setLocalFile(file.filePath, file.contents, file.publicPath)
    }

    return fs
  }

  /**
   * Build final compilation options,
   * based on partial options.
   *
   * @param {CompilerCompileOptionsInterface|object} [options]
   * @returns {CompilerCompileOptionsInterface|object}
   * @throws {Error}
   * @private
   */
  private _buildCompilationOptions (options?: Partial<CompilerCompileOptionsInterface>): CompilerCompileOptionsInterface {
    // Copy passed options
    options = assign({}, options || {})

    // Set-up root directory
    if (options.rootDirectory == null) {
      options.rootDirectory = process.cwd()
    } else if (typeof options.rootDirectory !== 'string') {
      throw new Error('Invalid rootDirectory passed for Compiler.compile.')
    } else {
      options.rootDirectory = path.resolve(options.rootDirectory)
    }

    // Populate empty 'files' field
    if (options.files == null) {
      options.files = []
    }

    // Validate if 'files' option is valid
    if (!Array.isArray(options.files) || options.files.filter(x => typeof x !== 'string').length > 0) {
      throw new Error('Invalid files passed for Compiler.compile.')
    }

    // Ensure that files have absolute paths
    options.files = options.files.map(filePath => {
      if (!path.isAbsolute(filePath)) {
        // @ts-ignore
        return path.resolve(path.join(options.rootDirectory, filePath))
      }

      return filePath
    })

    // Populate memoryFiles option
    if (options.memoryFiles == null) {
      options.memoryFiles = []
    }

    // Validate memoryFiles option
    if (!Array.isArray(options.memoryFiles)) {
      throw new Error('Invalid memoryFiles passed for Compiler.compile.')
    }

    // Ensure valid `useHostFileSystem` option
    if (options.useHostFileSystem == null) {
      options.useHostFileSystem = true
    } else {
      options.useHostFileSystem = !!options.useHostFileSystem
    }

    // Validate if 'entries' option is valid
    if (!Array.isArray(options.entries) || options.entries.filter(x => typeof x !== 'string').length > 0) {
      throw new Error('Invalid entries passed for Compiler.compile.')
    }

    // Ensure valid `entries`
    options.entries = options.entries.map(filePath => {
      if (!path.isAbsolute(filePath)) {
        // @ts-ignore
        return path.resolve(path.join(options.rootDirectory, filePath))
      }

      return filePath
    })

    return options as CompilerCompileOptionsInterface
  }
}

export {
  Compiler
}
