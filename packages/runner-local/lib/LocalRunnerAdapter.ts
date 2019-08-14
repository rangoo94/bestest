import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'
import { RunnerAdapter } from '@bestest/runner/lib/RunnerAdapter'
import { LocalRunnerSession } from './LocalRunnerSession'

class LocalRunnerAdapter extends RunnerAdapter {
  readonly type = '@bestest/runner-local'
  readonly name = 'Local sandboxed runner'

  /**
   * Create new local execution session,
   * through `@bestest/node-module-sandbox`.
   *
   * @param {FileSystemInterface|object} fileSystem
   * @param {function(*, LocalRunnerSession|null)} callback
   */
  createSession (
    fileSystem: FileSystemInterface,
    callback: (error: (any | null), session: LocalRunnerSession | null) => any
  ): void {
    callback(null, new LocalRunnerSession(fileSystem))
  }
}

export {
  LocalRunnerAdapter
}
