import Module = require('module')
import { FsInterface } from './FsInterface'

interface NodeModuleSandboxOptionsInterface {
  entryFilePath: string
  entryModule: Module
  requireFileSystem: FsInterface
  modules: Record<string, any>
}

export {
  NodeModuleSandboxOptionsInterface
}
