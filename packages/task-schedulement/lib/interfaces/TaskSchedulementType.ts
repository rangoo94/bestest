type TaskSchedulementType =
  'script-injection' |
  'tick' | 'tick-immediate' | 'tick-timeout' |
  'microtask' | 'microtask-immediate' | 'microtask-timeout' |
  'promise' | 'message-channel' | 'immediate' | 'timeout'

export {
  TaskSchedulementType
}
