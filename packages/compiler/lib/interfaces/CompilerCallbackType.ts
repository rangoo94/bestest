import { FileSystemInterface } from '@bestest/fs/lib/interfaces/FileSystemInterface'
import { CompilerCompileErrorInterface } from './CompilerCompileErrorInterface'

type CompilerCallbackType = (
  error: CompilerCompileErrorInterface | null,
  fs: FileSystemInterface | null,
  entries: string[] | null
) => any

export {
  CompilerCallbackType
}
