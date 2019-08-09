interface ProcessInterface {
  arch: string | null
  version: string | null
  versions: {
    v8: string | null
  }
}

export {
  ProcessInterface
}
