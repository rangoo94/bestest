import { getV8Package } from './getV8Package'

/**
 * Estimate available JS Heap Size,
 * based on data provided by V8 engine.
 *
 * @returns {number|null}  in megabytes
 */
function getTotalAvailableHeapSize (): number | null {
  const v8 = getV8Package()

  if (!v8 || typeof v8.getHeapStatistics !== 'function') {
    return null
  }

  return (v8.getHeapStatistics().total_available_size / 1024 / 1024) || null
}

export {
  getTotalAvailableHeapSize
}
