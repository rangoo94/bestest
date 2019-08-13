interface FsInterface {
  statSync: (filePath: string) => any
  existsSync: (filePath: string) => boolean
  realpathSync: (filePath: string) => string
  readFileSync: (filePath: string, encoding?: string) => any
}

export {
  FsInterface
}
