import * as fs from 'fs'
import * as path from 'path'
import { FsInterface } from './interfaces/FsInterface'
import { getPackageJson } from './getPackageJson'

/**
 * Get index (main) script file from selected directory.
 *
 * @param {string} dirPath
 * @param {object} [fileSystem]
 */
function getIndexFilePath (dirPath: string, fileSystem: FsInterface = fs): string {
  const pkg = getPackageJson(dirPath, fileSystem)
  const relativeFilePath = pkg && pkg.main ? pkg.main : 'index'

  return path.resolve(dirPath, relativeFilePath)
}

export {
  getIndexFilePath
}
