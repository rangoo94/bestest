import { FileMetadataInterface } from './FileMetadataInterface'
import { FileInterface } from './FileInterface'

interface FileSystemInterface {
  fs: any
  memoryFs: any

  createEmptyCopy (): FileSystemInterface
  clone (): FileSystemInterface
  inject (fileSystem: FileSystemInterface): void

  getLocalFiles (): Record<string, FileMetadataInterface>
  getLocalFilesWithContents (): Record<string, FileInterface>
  setLocalFile (filePath: string, contents: Buffer | string, publicPath?: string | null): FileInterface

  getAbsoluteFilePath (filePath: string): string

  createNativeEquivalent (): object
}

export {
  FileSystemInterface
}
