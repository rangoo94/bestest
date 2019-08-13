import { isAbsolute } from 'path'
import { FilePathResolutionType } from './interfaces/FilePathResolutionType'

/**
 * Get resolution type for selected file path.
 *
 * @param {string} filePath
 * @returns {string}
 */
function getFilePathResolutionType (filePath: string): FilePathResolutionType {
  if (/^\.\.?(?:\/|(?:\/\/))/.test(filePath)) {
    return 'relative'
  }

  if (isAbsolute(filePath)) {
    return 'absolute'
  }

  return 'global'
}

export {
  getFilePathResolutionType
}
