import * as fs from 'fs'
import * as path from 'path'
import { FsInterface } from './interfaces/FsInterface'

/**
 * Get package.json object from selected directory.
 *
 * @param {string} dirPath
 * @param {object|FsInterface} [fileSystem]
 * @returns {object|null}
 */
function getPackageJson (dirPath: string, fileSystem: FsInterface = fs) {
  const pkgPath = path.resolve(dirPath, 'package.json')

  try {
    return JSON.parse(fileSystem.readFileSync(pkgPath, 'utf8'))
  } catch (error) {
    return null
  }
}

export {
  getPackageJson
}
