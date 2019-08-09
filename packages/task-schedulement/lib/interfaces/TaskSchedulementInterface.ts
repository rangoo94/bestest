import { TaskSchedulementMetadataInterface } from './TaskSchedulementMetadataInterface'
import { TaskSchedulementType } from './TaskSchedulementType'
import { ScheduleTaskType } from './ScheduleTaskType'

interface TaskSchedulementInterface {
  id: TaskSchedulementType | string
  name: string
  isAvailable: () => boolean
  createScheduler: () => ScheduleTaskType | null
  toJSON: () => TaskSchedulementMetadataInterface
}

interface AvailableTaskSchedulementInterface extends TaskSchedulementInterface {
  isAvailable: () => true
  createScheduler: () => ScheduleTaskType
}

export {
  AvailableTaskSchedulementInterface,
  TaskSchedulementInterface
}
