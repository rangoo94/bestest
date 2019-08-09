interface CompilerCompileErrorInterface {
  error: Error | any
  filePath?: string | null
  details?: any | null
}

export {
  CompilerCompileErrorInterface
}
