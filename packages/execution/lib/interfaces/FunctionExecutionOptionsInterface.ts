import { AbstractFunctionExecutionOptionsInterface } from './AbstractFunctionExecutionOptionsInterface'
import { AsynchronousFunctionExecutionOptionsInterface } from './AsynchronousFunctionExecutionOptionsInterface'
import { SynchronousFunctionExecutionOptionsInterface } from './SynchronousFunctionExecutionOptionsInterface'

interface FunctionExecutionOptionsInterface extends
  AbstractFunctionExecutionOptionsInterface,
  SynchronousFunctionExecutionOptionsInterface,
  AsynchronousFunctionExecutionOptionsInterface {
  asynchronous: boolean
}

interface FunctionExecutionOptionsInterface extends
  AbstractFunctionExecutionOptionsInterface,
  SynchronousFunctionExecutionOptionsInterface,
  AsynchronousFunctionExecutionOptionsInterface {
  asynchronous: boolean
}

export {
  FunctionExecutionOptionsInterface
}
