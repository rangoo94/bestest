import MemoryFileSystem = require('memory-fs')
import { FileMetadataInterface } from './FileMetadataInterface'
import { FileInterface } from './FileInterface'

interface FileSystemInterface {
  fs: MemoryFileSystem
  memoryFs: MemoryFileSystem

  createEmptyCopy (): FileSystemInterface
  clone (): FileSystemInterface
  inject (fileSystem: FileSystemInterface): void

  getLocalFiles (): Record<string, FileMetadataInterface>
  getLocalFilesWithContents (): Record<string, FileInterface>
  setLocalFile (filePath: string, contents: Buffer | string, publicPath?: string | null): FileInterface
}

export {
  FileSystemInterface
}
