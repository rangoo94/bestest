import * as path from 'path'
import { RunnerSession } from '@bestest/runner/lib/RunnerSession'
import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'
import { NodeModuleSandbox } from '@bestest/node-module-sandbox/lib/NodeModuleSandbox'
import { LocalRunnerSessionOptionsInterface } from './interfaces/LocalRunnerSessionOptionsInterface'

class LocalRunnerSession extends RunnerSession<LocalRunnerSessionOptionsInterface> {
  private readonly _sandbox: NodeModuleSandbox

  /**
   * @param {FileSystemInterface|object} fileSystem
   * @param {LocalRunnerSessionOptionsInterface|object} [options]
   */
  constructor (fileSystem: FileSystemInterface, options?: Partial<LocalRunnerSessionOptionsInterface>) {
    super(fileSystem, options)

    // Initialize execution sandbox
    this._sandbox = new NodeModuleSandbox({
      modules: {
        fs: fileSystem.createNativeEquivalent()
      }
    })
  }

  /**
   * Include and execute (require) file within session context.
   *
   * @param {string} filePath
   * @param {function(*, *)} callback
   */
  includeFile (filePath: string, callback?: (error: (any | null), result?: any) => any) {
    if (!callback) {
      return this._sandbox.requireModule(filePath)
    }

    try {
      callback(null, this._sandbox.requireModule(filePath))
    } catch (error) {
      callback(error)
    }
  }

  /**
   * Execute script within session context.
   *
   * @param {function(function(*))} fnWithinSessionContext
   * @param {function(*, *)} callback
   */
  executeScript (
    fnWithinSessionContext: ((done: (result?: any) => any) => any),
    callback: (error: (any | null), result?: any) => any
  ): void {
    let isResolved = false

    // Create own callback, to ensure that callback will be run only once
    function finish (error: (any | null), result?: any) {
      if (isResolved) {
        return
      }

      isResolved = true

      callback(error, result)
    }

    // Execute script with callback within session context, and catch its errors
    try {
      this._sandbox.executeScriptWithArguments(
        fnWithinSessionContext,
        (result: any) => finish(null, result)
      )
    } catch (error) {
      finish(error)
    }
  }
}

export {
  LocalRunnerSession
}
