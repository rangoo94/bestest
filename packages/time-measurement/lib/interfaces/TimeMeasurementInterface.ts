import { TimeMeasurementMetadataInterface } from './TimeMeasurementMetadataInterface'
import { TimeMeasurementType } from './TimeMeasurementType'
import { TimeGetterType } from './TimeGetterType'

interface TimeMeasurementInterface {
  id: TimeMeasurementType | string
  name: string
  isAvailable: () => boolean
  createGetter: () => TimeGetterType | null
  toJSON: () => TimeMeasurementMetadataInterface
}

interface AvailableTimeMeasurementInterface extends TimeMeasurementInterface {
  isAvailable: () => true
  createGetter: () => TimeGetterType
}

export {
  AvailableTimeMeasurementInterface,
  TimeMeasurementInterface
}
