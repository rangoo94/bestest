import { AvailableTaskSchedulementInterface, TaskSchedulementInterface } from './interfaces/TaskSchedulementInterface'
import { taskSchedulementMethods } from './taskSchedulementMethods'

function getAvailableTaskSchedulementMethods (): AvailableTaskSchedulementInterface[] {
  const availableTaskSchedulementMethods = taskSchedulementMethods
    .filter((taskSchedulementMethod: TaskSchedulementInterface) => taskSchedulementMethod.isAvailable())

  return availableTaskSchedulementMethods as AvailableTaskSchedulementInterface[]
}

export {
  getAvailableTaskSchedulementMethods
}
