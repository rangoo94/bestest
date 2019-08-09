import { TimeMeasurementType } from './TimeMeasurementType'

interface TimeMeasurementMetadataInterface {
  id: TimeMeasurementType | string
  name: string
  available: boolean
}

export {
  TimeMeasurementMetadataInterface
}
