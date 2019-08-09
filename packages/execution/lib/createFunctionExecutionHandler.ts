/**
 * Create function handler,
 * which will execute a function multiple times during single run.
 *
 * It is created through the `new Function`,
 * to make it as most optimized as it could.
 *
 * @param {Function} fn
 * @param {int} executionsPerSample
 * @returns {Function()}
 */
function createFunctionExecutionHandler (fn: Function, executionsPerSample: number): () => void {
  // Create simple function for single execution per run
  if (executionsPerSample < 2) {
    return () => fn()
  }

  // Limit executions per run to very big value
  if (executionsPerSample === Infinity) {
    executionsPerSample = 1e9
  }

  // Build execution function code
  // It is much faster to evaluate it with number of executions included in code
  const fnCode =
    'return function(){' +
    'for(var i=0;i<' + executionsPerSample + ';i++){' +
    'execute()' +
    '}' +
    '}'

  return new Function('execute', fnCode)(fn)
}

export {
  createFunctionExecutionHandler
}
