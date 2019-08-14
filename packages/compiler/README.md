# @bestest/compiler

Compiler part of Bestest benchmarking tool.
Use it to compile your code in memory, to run it on different environments.

## Example

This example is using [Webpack adapter](https://www.npmjs.com/package/@bestest/compiler-webpack), and in-memory files only (although these are not required, you may have them locally).

```js
import { Compiler } from '@bestest/compiler'
import WebpackCompilerAdapter from '@bestest/compiler-webpack'

// Set-up in-memory files
const files = [
  {
    filePath: './index.js',
    publicPath: '/app.js',
    contents: `
      import file from "./abc"
      console.log("test-" + file)
    `
  },
  {
    filePath: './abc.js',
    publicPath: './abc.js',
    contents: `
      export default "value"
    `
  }
]

// Set-up compiler adapter
const adapter = new WebpackCompilerAdapter({
  webpackConfig: {}
})

// Set-up compiler
const compiler = new Compiler('webpack-example', adapter)

// Listen for events
compiler.events.on('initialize:start', () => console.log('Initialization started'))

// compiler.events.on('initialize:end', () => console.log('Initialization end'))
compiler.events.on('initialize:success', () => console.log('Initialization succeed'))
compiler.events.on('initialize:error', () => console.log('Initialization failed'))

compiler.events.on('compile:start', () => console.log('Compilation started'))

// compiler.events.on('compile:end', () => console.log('Compilation end'))
compiler.events.on('compile:success', () => console.log('Compilation succeed'))
compiler.events.on('compile:error', () => console.log('Compilation failed'))


// Set-up compilation configuration
const config = {
  entries: [ './index' ],
  memoryFiles: files
}

// Compile files
compiler.initialize(error => {
  if (error) {
    throw new Error('There was a problem while initializing the compiler adapter.')
  }

  compiler.compile(config, (error, fs, entries) => {
    console.log('Error  ', error)
    console.log('Entries', entries)

    if (fs) {
      console.log('Files  ', fs.getLocalFilesWithContents())
    }
  })
})
```

## Changelog

* **1.0.2** (on 2019-08-14): delay events & callbacks, to ensure that flow will work even despite errors
* **1.0.1** (on 2019-08-09): fix Webpack adapter link in README file
* **1.0.0** (on 2019-08-09): initial version
