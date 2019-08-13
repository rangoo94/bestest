import * as fs from 'fs'
import * as path from 'path'
import Module = require('module')
import { FsInterface } from './interfaces/FsInterface'
import { getFilePathResolutionType } from './getFilePathResolutionType'
import { getIndexFilePath } from './getIndexFilePath'

/**
 * Resolve existing script file path.
 *
 * @param {string} filePath
 * @param {Module|object} parentModule
 * @param {string[]} [extensions]
 * @param {object} [fileSystem]
 * @param {boolean} [allowNoExtension]
 * @returns {string|null}
 */
function resolveFilePath (
  filePath: string,
  parentModule: Module,
  extensions: string[] = [ '.js', '.json' ],
  fileSystem: FsInterface = fs,
  allowNoExtension: boolean = true
): string | null {
  // Ensure extensions will have empty one as well
  const finalExtensions = allowNoExtension ? [ '' ].concat(extensions) : extensions

  // Retrieve information about script resolution
  const type = getFilePathResolutionType(filePath)

  // Resolve global file path (probably native or from node_modules directory)
  if (type === 'global') {
    const directories = parentModule.paths

    // Iterate over all global directories
    for (let i = 0; i < directories.length; i++) {
      const absoluteFilePath = path.resolve(directories[i], filePath)
      const resolvedFilePath = resolveFilePath(absoluteFilePath, parentModule, finalExtensions, fileSystem, false)

      if (resolvedFilePath !== null) {
        return resolvedFilePath
      }
    }

    return null
  }

  // @ts-ignore
  const absoluteFilePath = type === 'absolute' ? filePath : path.resolve(parentModule.path, filePath)

  // Iterate over all possible extensions
  for (let i = 0; i < finalExtensions.length; i++) {
    const finalFilePath = absoluteFilePath + finalExtensions[i]

    // Ignore not existing files
    if (!fileSystem.existsSync(finalFilePath)) {
      continue
    }

    // Get file stats
    const stat = fileSystem.statSync(finalFilePath)

    // Determine index file for directories
    if (stat.isDirectory()) {
      const mainFilePath = getIndexFilePath(finalFilePath, fileSystem)
      const expectedFilePath = resolveFilePath(mainFilePath, parentModule, finalExtensions, fileSystem, false)

      if (expectedFilePath !== null) {
        return expectedFilePath
      }
    }

    // Resolve symlink or get direct file path
    return stat.isFile() ? finalFilePath : fs.realpathSync(finalFilePath)
  }

  return null
}

export {
  resolveFilePath
}
