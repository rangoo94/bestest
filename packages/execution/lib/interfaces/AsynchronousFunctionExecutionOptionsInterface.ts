import { ScheduleTaskType } from '@bestest/task-schedulement/lib/interfaces/ScheduleTaskType'
import { AbstractFunctionExecutionOptionsInterface } from './AbstractFunctionExecutionOptionsInterface'

interface AsynchronousFunctionExecutionOptionsInterface extends AbstractFunctionExecutionOptionsInterface {
  maxConcurrentExecutions: number
  scheduleTask: ScheduleTaskType
}

export {
  AsynchronousFunctionExecutionOptionsInterface
}
