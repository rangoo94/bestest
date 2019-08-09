import { TaskSchedulementInterface } from './interfaces/TaskSchedulementInterface'
import { TaskSchedulementType } from './interfaces/TaskSchedulementType'
import { ScheduleTaskType } from './interfaces/ScheduleTaskType'

/**
 * Class which represents task schedulement method.
 * It contains meta-information about that,
 * and allows checking if it's available in current environment and creating scheduler.
 *
 * @property {string} id
 * @property {string} name
 * @class
 */
class CustomTaskSchedulement implements TaskSchedulementInterface {
  readonly id: TaskSchedulementType | string
  readonly name: string
  private readonly _isAvailable: () => boolean
  private readonly _createScheduler: () => ScheduleTaskType

  /**
   * @param {object} options
   * @param {string} options.id
   * @param {string} options.name
   * @param {function(): boolean} options.check
   * @param {function(): function(function)} options.factory  Factory for task scheduler
   * @constructor
   */
  public constructor (options: { id: string, name: string, check: () => boolean, factory: () => ScheduleTaskType }) {
    this.id = options.id
    this.name = options.name
    this._isAvailable = options.check
    this._createScheduler = options.factory
  }

  /**
   * Check if task schedulement method is available
   * in current environment.
   *
   * @returns {boolean}
   */
  isAvailable () {
    return this._isAvailable()
  }

  /**
   * Create task scheduler.
   * It should return a function,
   * which will run function asynchronously.
   *
   * @returns {function(function)}
   */
  createScheduler () {
    return this.isAvailable() ? this._createScheduler() : null
  }

  /**
   * Get metadata of task schedulement method.
   *
   * @returns {TaskSchedulementMetadataInterface}
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
  CustomTaskSchedulement
}
