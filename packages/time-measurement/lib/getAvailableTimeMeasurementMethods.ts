import { AvailableTimeMeasurementInterface, TimeMeasurementInterface } from './interfaces/TimeMeasurementInterface'
import { timeMeasurementMethods } from './timeMeasurementMethods'

function getAvailableTimeMeasurementMethods (): AvailableTimeMeasurementInterface[] {
  const availableTimeMeasurementMethods = timeMeasurementMethods
    .filter((timeMeasurementMethod: TimeMeasurementInterface) => timeMeasurementMethod.isAvailable())

  return availableTimeMeasurementMethods as AvailableTimeMeasurementInterface[]
}

export {
  getAvailableTimeMeasurementMethods
}
