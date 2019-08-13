import * as path from 'path'
import * as fs from 'fs'
import joinPath = require('memory-fs/lib/join')
import { assign } from '@bestest/utils/lib/assign'
import { FileSystem } from '@bestest/fs/lib/FileSystem'
import { CompilerAdapterCompileOptionsInterface } from '@bestest/compiler/lib/interfaces/CompilerAdapterCompileOptionsInterface'
import { CompilerCallbackType } from '@bestest/compiler/lib/interfaces/CompilerCallbackType'
import { CompilerAdapter } from '@bestest/compiler/lib/CompilerAdapter'
import { WebpackCompilerAdapterOptionsInterface } from './interfaces/WebpackCompilerAdapterOptionsInterface'
import { buildUniqueName } from './buildUniqueName'

/**
 * Create FileSystem (@bestest/fs) instance,
 * which will have `.join` method required by Webpack.
 *
 * @param {string} publicPath
 * @param {string} outputPath
 * @returns {object}
 * @private
 */
function createFileSystem (publicPath: string, outputPath: string): FileSystem {
  // Create file system instance
  const fs = new FileSystem({
    publicPathPrefix: publicPath,
    rootDirectory: outputPath,
    useHostFileSystem: false
  })

  // Return it back, when it has Webpack 'join' method
  if (fs.memoryFs.join) {
    return fs
  }

  // Create FS proxy, adding `join` method to memoryFs, but not modifying original object
  const nextFs = Object.create(fs)
  nextFs.memoryFs = Object.create(nextFs.memoryFs)
  nextFs.memoryFs.join = joinPath

  return nextFs
}

/**
 * Bestest Compiler adapter, which uses Webpack.
 *
 * @class
 */
class WebpackCompilerAdapter extends CompilerAdapter<WebpackCompilerAdapterOptionsInterface> {
  readonly type = '@bestest/compiler-webpack'
  readonly name = 'Webpack 4.x'

  static defaultOptions = {
    webpackConfig: null,
    removeEntries: true,
    entryName: 'bootstrap.js'
  }

  /**
   * Compile code for use.
   *
   * @param {CompilerAdapterCompileOptionsInterface|object} options
   * @param {function(object|null, FileSystemInterface|object|null, string[])} callback
   */
  compile (options: CompilerAdapterCompileOptionsInterface, callback: CompilerCallbackType): void {
    // Retrieve 'webpack' package
    const webpack = require('webpack')

    // Build Webpack configuration
    const webpackConfig = this._buildWebpackConfiguration(options)

    // Create Webpack compiler
    const compiler = webpack(webpackConfig)

    // Extract paths from compiler
    const publicPath = compiler.options.output.publicPath
    const outputPath = compiler.options.output.path

    // Create virtual FS for output files
    const output = createFileSystem(publicPath, outputPath)

    // Extract file system wrappers
    const inputFs = options.fs.fs
    const outputFs = output.memoryFs

    // Use our file systems in Webpack
    compiler.inputFileSystem = inputFs
    compiler.outputFileSystem = outputFs
    compiler.resolvers.normal.fileSystem = inputFs
    compiler.resolvers.context.fileSystem = outputFs

    // Run Webpack compiler
    compiler.run((error: any, stats: any) => {
      // Handle regular error
      if (error) {
        callback({ error }, null, null)
        return
      }

      // Handle error from Webpack compilation
      if (stats.hasErrors()) {
        // Create instance of error
        const error = new Error('Webpack compilation error')

        // Extract compilation error details
        // @ts-ignore
        const details = stats.toJson().errors

        callback({ error, details }, null, null)
        return
      }

      // Extract output file system
      const fs = output.fs

      // Extract information about compilation assets
      const assets = stats.compilation.assets

      // Iterate over all files generated by Webpack
      for (const filePath in assets) {
        if (!assets.hasOwnProperty(filePath)) {
          continue
        }

        // Retrieve information about file path in FS
        const existsAt = assets[filePath].existsAt

        try {
          // Build file paths for file system
          const absoluteFilePath = path.isAbsolute(filePath) ? filePath : path.join(outputPath, filePath)
          const outputFilePath = typeof existsAt === 'string' && fs.existsSync(existsAt) ? existsAt : absoluteFilePath

          // Retrieve contents
          // TODO: Think if it shouldn't be Buffer instead
          const contents = fs.readFileSync(outputFilePath, 'utf-8')

          // Save information about file
          output.setLocalFile(absoluteFilePath, contents)
        } catch (error) {
          // Catch errors during file retrieval
          callback({ error, filePath }, null, null)
          return
        }
      }

      // Retrieve information about emitted entry chunks
      const entries = stats.toJson().chunks
        .reduce((acc: string[], chunk: { files: string[] }) => [ ...acc, ...chunk.files ], [])
        .map((filePath: string) => path.isAbsolute(filePath) ? filePath : path.join(outputPath, filePath))

      // Inform about successful compilation
      callback(null, output, entries)
    })
  }

  /**
   * Build Webpack configuration,
   * based on adapter and compilation options.
   *
   * @param {CompilerAdapterCompileOptionsInterface|object} options
   * @returns {object}
   * @private
   */
  private _buildWebpackConfiguration (options: CompilerAdapterCompileOptionsInterface): Record<string, any> {
    // Retrieve configuration passed to adapter
    const webpackConfig = assign({}, this._getRawWebpackConfiguration(options))

    // Calculate entry-points
    const entries = this.options.removeEntries ? {} : assign({}, webpackConfig.entry)

    // Determine name for tests entry-point
    const entryName = buildUniqueName(this.options.entryName, Object.keys(entries))

    // Attach tests entry-point
    entries[entryName] = options.entries

    // Update entries
    webpackConfig.entry = entries

    return webpackConfig
  }

  /**
   * Get Webpack configuration from adapter and compilation options.
   *
   * @param {CompilerAdapterCompileOptionsInterface|object} options
   * @returns {object}
   * @private
   */
  private _getRawWebpackConfiguration (options: CompilerAdapterCompileOptionsInterface): Record<string, any> {
    // Extract required options
    const { rootDirectory } = options

    // Auto-detect webpack configuration or used passed one
    const webpackConfig = this.options.webpackConfig == null
      ? path.join(rootDirectory, 'webpack.config.js')
      : this.options.webpackConfig

    // Handle config passed as file path
    if (typeof webpackConfig === 'string') {
      // Build absolute path
      const absoluteConfigPath = path.isAbsolute(webpackConfig)
        ? webpackConfig
        : path.resolve(path.join(process.cwd(), webpackConfig))

      // TODO: Handle code from in-memory FS?
      // Check if it exists
      if (!fs.existsSync(absoluteConfigPath)) {
        throw new Error(`Couldn't find file "${absoluteConfigPath}" from webpackConfig option.`)
      }

      // Require pointed module
      return require(absoluteConfigPath)
    }

    // Use direct configuration
    return webpackConfig
  }
}

export {
  WebpackCompilerAdapter
}
