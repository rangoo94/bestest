import { AbstractFunctionExecutionOptionsInterface } from './AbstractFunctionExecutionOptionsInterface'

interface SynchronousFunctionExecutionOptionsInterface extends AbstractFunctionExecutionOptionsInterface {
  estimatedSampleDuration: number
  maxExecutionsPerSample: number
}

export {
  SynchronousFunctionExecutionOptionsInterface
}
