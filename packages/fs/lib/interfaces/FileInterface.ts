import { FileMetadataInterface } from './FileMetadataInterface'

interface FileInterface extends FileMetadataInterface {
  contents: Buffer | string
}

export {
  FileInterface
}
