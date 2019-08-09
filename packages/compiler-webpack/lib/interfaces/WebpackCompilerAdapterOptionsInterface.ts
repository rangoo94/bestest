interface WebpackCompilerAdapterOptionsInterface {
  webpackConfig: string | Record<string, any> | null
  removeEntries: boolean
  entryName: string
}

export {
  WebpackCompilerAdapterOptionsInterface
}
