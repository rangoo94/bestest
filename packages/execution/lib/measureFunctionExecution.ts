import { AsynchronousFunctionExecutionOptionsInterface } from './interfaces/AsynchronousFunctionExecutionOptionsInterface'
import { SynchronousFunctionExecutionOptionsInterface } from './interfaces/SynchronousFunctionExecutionOptionsInterface'
import { FunctionExecutionMeasurementInterface } from './interfaces/FunctionExecutionMeasurementInterface'
import { FunctionExecutionOptionsInterface } from './interfaces/FunctionExecutionOptionsInterface'
import { AsynchronousTestFunctionType } from './interfaces/AsynchronousTestFunctionType'
import { SynchronousTestFunctionType } from './interfaces/SynchronousTestFunctionType'
import { TestFunctionType } from './interfaces/TestFunctionType'
import { measureAsynchronousFunctionExecutionWithoutDetails } from './internal/measureAsynchronousFunctionExecutionWithoutDetails'
import { measureSynchronousFunctionExecutionWithoutDetails } from './internal/measureSynchronousFunctionExecutionWithoutDetails'
import { measureAsynchronousFunctionExecution } from './internal/measureAsynchronousFunctionExecution'
import { measureSynchronousFunctionExecution } from './internal/measureSynchronousFunctionExecution'
import { analyzeInitialFunctionExecution } from './analyzeInitialFunctionExecution'
import { getFunctionExecutionOptions } from './getFunctionExecutionOptions'

function measureSync (
  fn: SynchronousTestFunctionType,
  options: SynchronousFunctionExecutionOptionsInterface,
  callback: (measurement: FunctionExecutionMeasurementInterface) => any
) {
  // Select proper measurement function
  const execute = options.includeDetails
    ? measureSynchronousFunctionExecution
    : measureSynchronousFunctionExecutionWithoutDetails

  // Analyze handler execution
  const analysis = analyzeInitialFunctionExecution(fn, options)

  // Measure function execution
  const measurement = execute(analysis.handler, options, analysis.executionsPerSample)

  // Include run from analysis
  if (analysis.took !== null) {
    measurement.executions.total++

    const type = analysis.failed ? 'failed' : 'successful'

    measurement.executions[type]++

    if (measurement.timeEntries) {
      measurement.timeEntries[type].unshift(analysis.took)
    }
  }

  // Run callback
  callback(measurement)
}

function measureAsync (
  fn: AsynchronousTestFunctionType,
  options: AsynchronousFunctionExecutionOptionsInterface,
  callback: (measurement: FunctionExecutionMeasurementInterface) => any
) {
  // Select proper measurement function
  const execute = options.includeDetails
    ? measureAsynchronousFunctionExecution
    : measureAsynchronousFunctionExecutionWithoutDetails

  // Measure function execution
  execute(fn, options, callback)
}

/**
 * Measure function execution time.
 *
 * @param {Function} fn
 * @param {FunctionExecutionOptionsInterface|object} options
 * @param {function(FunctionExecutionMeasurementInterface)} callback
 */
function measureFunctionExecution (
  fn: TestFunctionType,
  options: Partial<FunctionExecutionOptionsInterface>,
  callback: (measurement: FunctionExecutionMeasurementInterface) => any
) {
  // Populate options object
  const finalOptions = getFunctionExecutionOptions(options)

  if (finalOptions.asynchronous) {
    measureAsync(fn as AsynchronousTestFunctionType, finalOptions, callback)
  } else {
    measureSync(fn as SynchronousTestFunctionType, finalOptions, callback)
  }
}

export {
  measureFunctionExecution
}
