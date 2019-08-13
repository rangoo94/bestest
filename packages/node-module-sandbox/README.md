# @bestest/node-module-sandbox

This module is trying to separate node modules creation in selected context, without touching i.e. regular `require` cache.

> 
> **Warning:**
> Remember, you should not treat this as a safe sandbox solution!
> It is also changing some default behaviors, so you may treat is as a buggy as well.
> 

## How to use it

### Execute code (with sandboxed modules cache)

```js
// fn.js
exports.fn = () => 3

// main.js
const { NodeModuleSandbox } = require('@bestest/node-module-sandbox')

const sandbox1 = new NodeModuleSandbox()
const sandbox2 = new NodeModuleSandbox()

// Modify fn.js module in "sandbox1"
sandbox1.executeScript('require("./fn").fn = () => 5')

// Verify that './fn' has been modified in "sandbox1"
console.log(sandbox1.executeScript('require("./fn").fn()')) // 5

// Verify that './fn' has been modified in "sandbox2"
console.log(sandbox2.executeScript('require("./fn").fn()')) // 3

// Verify that './fn' has not been modified locally
console.log(require('./fn').fn()) // 3
```

### Passing arguments (or callback)

```js
const { NodeModuleSandbox } = require('@bestest/node-module-sandbox')

const sandbox = new NodeModuleSandbox()

// Remember that this function will be serialized,
// so you should not use anything from outside of its context.
const fn = (callback) => {
  setTimeout(() => {
    callback(10)    
  }, 1000)
}

// Remember that this function will be serialized,
// so you should not use anything from outside of its context.
const fn2 = (x, y, z) => {
    console.log('Sum:', x + y + z)
}

sandbox.executeScriptWithArguments(fn, value => {
  console.log('The value is', value)
})

sandbox.executeScriptWithArguments(fn2, 1, 2, 3)
```

### Passing custom file system

```js
const { FileSystem } = require('@bestest/fs')
const { NodeModuleSandbox } = require('@bestest/node-module-sandbox')

const fileSystem = new FileSystem()

fileSystem.setLocalFile('./fixture.json', '"text"')

fileSystem.setLocalFile('./example.js', `
  module.exports = {
    root: "/root/"
  }
`)

fileSystem.setLocalFile('./a.js', `
  // File system can be mocked as well
  const fs = require('fs')
  const fixture = JSON.parse(fs.readFileSync('./fixture.json'))

  console.log(require('./example').root + fixture) // "/root/text"
`)

const sandbox = new NodeModuleSandbox({
  modules: { fs: fileSystem.fs }
})

sandbox.requireModule('./a.js', module) // logs "/root/text"
sandbox.requireModule('./a.js', module) // does nothing - this module is already resolved
sandbox.executeScript('require("./a.js")') // does nothing - this module is already resolved
```

## Other options

* If you would like to run code in better sandbox:
  * You may use native [vm](https://nodejs.org/api/vm.html) module, which will create new V8 context (but i.e. without access to Node.js modules).
* If you would like to run code in separate thread:
  * You may think about [worker threads](https://nodejs.org/api/worker_threads.html), available since Node.js 10
  * You can run it as a separate process through [child_process](https://nodejs.org/api/child_process.html) module
  * You may also want to take a look at [cluster](https://nodejs.org/api/cluster.html) module
  
## Problems

### Extensions

Due to the way it is resolved, there are some differences in behavior:

* `.js` and `.json` files will be loaded without any registered extension handlers (i.e. `ts-node` or `@babel/register`)
* Native modules may be replaced by selected implementation
* All other files will be loaded regularly, outside of sandbox

### Global context is still available

Module context (`module`, `require`, `__dirname`, `__filename`) will be replaced, but other [global objects](https://nodejs.org/api/globals.html) will still be the same.

### ESM imports are not modified

Unfortunately, there is no API yet available to access and modify ESMLoader.

## Changelog

- **1.1.0** (on 13.08.2019): add option to pass arguments for executed scripts
- **1.0.0** (on 13.08.2019): initial version
