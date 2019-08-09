import { FileInterface } from '@bestest/fs/lib/interfaces/FileInterface'
import { FileMetadataInterface } from '@bestest/fs/lib/interfaces/FileMetadataInterface'

interface CompilerCompileOptionsInterface {
  /** Root directory for current compilation - defaults to process.cwd() */
  rootDirectory: string

  /** List of file paths which should be passed for compilation */
  files?: string[] | null

  /** List of bootstrapping file paths */
  entries: string[]

  /** Dynamic files put to in-memory FS */
  memoryFiles?: Array<FileInterface> | null

  /** Should use host file system, or only in-memory files? */
  useHostFileSystem?: boolean
}

export {
  CompilerCompileOptionsInterface
}
