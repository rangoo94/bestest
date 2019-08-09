import { TimeGetterType } from '@bestest/time-measurement/lib/interfaces/TimeGetterType'

interface AbstractFunctionExecutionOptionsInterface {
  duration: number
  includeDetails: boolean
  getCurrentTime: TimeGetterType
}

export {
  AbstractFunctionExecutionOptionsInterface
}
