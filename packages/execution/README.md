# @bestest/execution

Helpers to measure function execution time. Required for Bestest benchmarking tool.

# Example

```js
const { measureFunctionExecution } = require('@bestest/execution')

const testCase = () => Math.random()
const testOptions = {
  maxExecutionsPerSample: Infinity,
  includeDetails: false
}

measureFunctionExecution(testCase, testOptions, measurement => {
  console.log(measurement)

  // Remember, that presented time is in picoseconds (10^-12 s)
  //
  // {
  //   timePrecision: 23.12480712166172,
  //   executionsPerSample: 2696,
  //   concurrentExecutions: 1,
  //   startTime: 132188876478633000,
  //   endTime: 132189876488453000,
  //   took: 1000009820000,
  //   executions: { total: 134516921, successful: 134516921, failed: 0 },
  //   timeEntries: undefined
  // }
})
```

## Changelog

* **1.0.1** (on 2019-08-07): initial version
