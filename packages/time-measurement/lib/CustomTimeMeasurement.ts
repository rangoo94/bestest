import { TimeMeasurementInterface } from './interfaces/TimeMeasurementInterface'
import { TimeMeasurementType } from './interfaces/TimeMeasurementType'
import { TimeGetterType } from './interfaces/TimeGetterType'

/**
 * Class which represents time measurement method.
 * It contains meta-information about that,
 * and allows checking if it's available in current environment and creating getter.
 *
 * @property {string} id
 * @property {string} name
 * @class
 */
class CustomTimeMeasurement implements TimeMeasurementInterface {
  readonly id: TimeMeasurementType | string
  readonly name: string
  private readonly _isAvailable: () => boolean
  private readonly _createGetter: () => TimeGetterType

  /**
   * @param {object} options
   * @param {string} options.id
   * @param {string} options.name
   * @param {function(): boolean} options.check
   * @param {function(): function(): number} options.factory  Factory for current time getter, in picoseconds
   * @constructor
   */
  public constructor (options: { id: string, name: string, check: () => boolean, factory: () => TimeGetterType }) {
    this.id = options.id
    this.name = options.name
    this._isAvailable = options.check
    this._createGetter = options.factory
  }

  /**
   * Check if current time measurement method is available
   * in current environment.
   *
   * @returns {boolean}
   */
  isAvailable () {
    return this._isAvailable()
  }

  /**
   * Create time getter factory.
   * It should return a function,
   * which will return current HR time in picoseconds.
   *
   * Picoseconds (10^(-12) s) are required to have integer value,
   * on which calculations will be faster than float.
   *
   * @returns {function(): number}
   */
  createGetter () {
    return this.isAvailable() ? this._createGetter() : null
  }

  /**
   * Get metadata of current time measurement method.
   *
   * @returns {TimeMeasurementMetadataInterface}
   */
  toJSON () {
    return {
      id: this.id,
      name: this.name,
      available: this.isAvailable()
    }
  }
}

export {
  CustomTimeMeasurement
}
