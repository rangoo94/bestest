import { RunnerSessionInterface } from './RunnerSessionInterface'

type CreateSessionCallbackType = (error: (any | null), session: RunnerSessionInterface | null) => any

export {
  CreateSessionCallbackType
}
