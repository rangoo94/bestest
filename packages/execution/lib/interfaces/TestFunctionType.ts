import { SynchronousTestFunctionType } from './SynchronousTestFunctionType'
import { AsynchronousTestFunctionType } from './AsynchronousTestFunctionType'

type TestFunctionType = SynchronousTestFunctionType | AsynchronousTestFunctionType

export {
  TestFunctionType
}
