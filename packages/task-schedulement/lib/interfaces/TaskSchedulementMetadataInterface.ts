import { TaskSchedulementType } from './TaskSchedulementType'

interface TaskSchedulementMetadataInterface {
  id: TaskSchedulementType | string
  name: string
  available: boolean
}

export {
  TaskSchedulementMetadataInterface
}
