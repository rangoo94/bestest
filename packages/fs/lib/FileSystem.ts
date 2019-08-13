import * as fs from 'fs'
import * as path from 'path'
const UnionFS = require('unionfs')
import { Volume } from 'memfs'
import { buildOptions } from '@bestest/utils/lib/buildOptions'
import { assign } from '@bestest/utils/lib/assign'
import { FileSystemOptionsInterface } from './interfaces/FileSystemOptionsInterface'
import { FileMetadataInterface } from './interfaces/FileMetadataInterface'
import { FileSystemInterface } from './interfaces/FileSystemInterface'
import { FileInterface } from './interfaces/FileInterface'

/**
 * Represents file system wrapper,
 * used to track files put in-memory, during compilation.
 *
 * TODO: Track files put directly into memory-fs?
 *
 * @class
 */
class FileSystem implements FileSystemInterface {
  readonly fs: any // 'Volume' is not supported
  readonly memoryFs: any // 'Volume' is not supported
  readonly options: FileSystemOptionsInterface
  private readonly _files: Record<string, FileInterface>

  static defaultOptions: FileSystemOptionsInterface = {
    publicPathPrefix: '',
    rootDirectory: null,
    useHostFileSystem: true
  }

  /**
   * @param {FileSystemOptionsInterface|object} [options]
   */
  constructor (options?: Partial<FileSystemOptionsInterface>) {
    // Set-up FS options
    this.options = buildOptions(
      options || {},
      (this.constructor as typeof FileSystem).defaultOptions
    ) as FileSystemOptionsInterface

    // Validate public path prefix
    if (typeof this.options.publicPathPrefix !== 'string') {
      throw new Error('Invalid publicPathPrefix passed for FileSystem.')
    }

    // Remove trailing slash from public path prefix
    this.options.publicPathPrefix = this.options.publicPathPrefix.replace(/\/+$/, '')

    // Validate root directory
    if (this.options.rootDirectory != null && typeof this.options.rootDirectory !== 'string') {
      throw new Error('Invalid rootDirectory passed for FileSystem.')
    }

    // Initialize map of inserted files
    this._files = {}

    // Initialize in-memory file system
    this.memoryFs = new Volume()

    // Initialize exposed file system
    this.fs = new UnionFS.Union()

    // Use host file system, if it's expected
    if (this.options.useHostFileSystem) {
      // @ts-ignore
      this.fs.use(fs)
    }

    // Use in-memory file system
    // @ts-ignore
    this.fs.use(this.memoryFs)
  }

  /**
   * Initialize empty copy of file system,
   * with same options.
   *
   * @returns {FileSystem}
   */
  createEmptyCopy (): FileSystemInterface {
    return new FileSystem(this.options)
  }

  /**
   * Create copy of file system,
   * with the same options and files included.
   *
   * @returns {FileSystem}
   */
  clone (): FileSystemInterface {
    const clonedFs = this.createEmptyCopy()
    clonedFs.inject(this)
    return clonedFs
  }

  /**
   * Inject files from another file system.
   *
   * @param {FileSystem} fileSystem
   */
  inject (fileSystem: FileSystemInterface) {
    // Get local files from external FS
    const files = fileSystem.getLocalFilesWithContents()

    // Inject all files in current FS
    for (const key in files) {
      if (!files.hasOwnProperty(key)) {
        continue
      }

      const file = files[key]

      this.setLocalFile(file.filePath, file.contents, file.publicPath)
    }
  }

  /**
   * Get local files with contents information.
   *
   * @returns {object[]|Array<{ filePath: string, publicPath: string, contents: Buffer|string }>}
   */
  getLocalFilesWithContents (): Record<string, FileInterface> {
    return assign({}, this._files)
  }

  /**
   * Get local files meta-data.
   *
   * @returns {object[]|Array<{ filePath: string, publicPath: string }>}
   */
  getLocalFiles (): Record<string, FileMetadataInterface> {
    return this.getLocalFilesWithContents()
  }

  /**
   * Save local file in-memory.
   *
   * @param {string} filePath
   * @param {Buffer|string} contents
   * @param {string|null} [publicPath]
   * @returns {FileInterface|object}
   */
  setLocalFile (filePath: string, contents: Buffer | string, publicPath?: string | null): FileInterface {
    // Initialize basic data (and ensure they are correct)
    const absoluteFilePath = this.getAbsoluteFilePath(filePath)
    const finalPublicPath = publicPath || this._getPublicPath(absoluteFilePath)

    // Initialize file object
    const file = {
      filePath: absoluteFilePath,
      publicPath: finalPublicPath,
      contents: contents
    }

    // Save file in memory FS
    this.memoryFs.mkdirpSync(path.dirname(absoluteFilePath))
    this.memoryFs.writeFileSync(absoluteFilePath, contents)

    // Save data about selected file
    this._files[filePath] = file

    return file
  }

  /**
   * Try to get current root directory for FS.
   *
   * @returns {string}
   * @private
   */
  private _getRootDirectory (): string {
    return this.options.rootDirectory || process.cwd()
  }

  /**
   * Build absolute path for file, based on root directory.
   *
   * @param {string} filePath
   * @returns {string}
   * @private
   */
  getAbsoluteFilePath (filePath: string): string {
    // Ignore when it's already absolute
    if (path.isAbsolute(filePath)) {
      return filePath
    }

    // Build absolute file path
    return path.resolve(path.join(this._getRootDirectory(), filePath))
  }

  /**
   * Get public file path, when it's not provided.
   * It will be used by server with static files.
   *
   * @param {string} absoluteFilePath
   * @returns {string}
   * @private
   */
  private _getPublicPath (absoluteFilePath: string): string {
    // Find root directory
    const rootDir = this._getRootDirectory()

    // Find relative path from root director
    const relativeFilePath = path.relative(rootDir, absoluteFilePath)

    const publicPathPrefix = this.options.publicPathPrefix === '' ? '' : this.options.publicPathPrefix + '/'

    // Clean-up file path
    return `${publicPathPrefix}${relativeFilePath}`
      // Ensure proper path
      .replace(/\\\\/g, '/')

      // Replace /../ in path to __
      .replace(/(^|\/)\.\.(\/)/g, '$1__$2')
  }

  /**
   * Create equivalent of native FS module,
   * including all missing features.
   *
   * @returns {object}
   */
  createNativeEquivalent (): object {
    const fsCopy = this.clone().fs

    // Copy all native FS properties
    for (const key in fs) {
      if (fs.hasOwnProperty(key) && !(key in fsCopy)) {
        // @ts-ignore
        fsCopy[key] = fs[key]
      }
    }

    // Copy 'promises' implementation from native FS
    if (fs.promises && fs.promises !== fsCopy.promises) {
      for (const key in fs.promises) {
        if (fs.promises.hasOwnProperty(key) && !(key in fsCopy.promises)) {
          // @ts-ignore
          fsCopy.promises[key] = fs.promises[key]
        }
      }
    }

    return fsCopy
  }
}

export {
  FileSystem
}
