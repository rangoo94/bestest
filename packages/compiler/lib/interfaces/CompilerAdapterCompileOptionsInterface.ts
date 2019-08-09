import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'

interface CompilerAdapterCompileOptionsInterface {
  /** Root directory for current compilation - defaults to process.cwd() */
  rootDirectory: string

  /** List of file paths which should be passed for compilation */
  files?: string[] | null

  /** List of bootstrapping file paths */
  entries: string[]

  /** File system to use for compilation */
  fs: FileSystemInterface
}

export {
  CompilerAdapterCompileOptionsInterface
}
