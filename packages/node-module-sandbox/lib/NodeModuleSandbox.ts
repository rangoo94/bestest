import * as fs from 'fs'
import * as path from 'path'
import Module = require('module')
import stripBom = require('strip-bom')
import { buildOptions } from '@bestest/utils/lib/buildOptions'
import { NodeModuleSandboxOptionsInterface } from './interfaces/NodeModuleSandboxOptionsInterface'
import { resolveFilePath } from './resolveFilePath'

/**
 * Class to execute code in more sand-boxed and mockable environment.
 *
 * @class
 */
class NodeModuleSandbox {
  readonly options: NodeModuleSandboxOptionsInterface
  private readonly _modulesCache: Record<string, Module> = {}
  private readonly _filePathsCache: Record<string, string> = {}
  private readonly _entryModule: Module

  static defaultOptions: Partial<NodeModuleSandboxOptionsInterface> = {
    entryFilePath: path.resolve(process.cwd(), `sandbox.${Math.random()}.js`),
    entryModule: module,
    modules: {
      fs: fs
    }
  }

  /**
   * @param {NodeModuleSandboxOptionsInterface|object} [options]
   */
  constructor (options?: Partial<NodeModuleSandboxOptionsInterface>) {
    // Build options
    this.options = buildOptions(
      options || {},
      (this.constructor as typeof NodeModuleSandbox).defaultOptions
    ) as NodeModuleSandboxOptionsInterface

    // Get current modules mapping
    const defaultModules = (this.constructor as typeof NodeModuleSandbox).defaultOptions.modules || {}

    // Combine passed modules with defaults
    this.options.modules = buildOptions(this.options.modules, defaultModules || {})

    // Use FS module from passed modules as default FS
    if (!this.options.requireFileSystem) {
      this.options.requireFileSystem = this.options.modules.fs
    }

    // Initialize entry module, where foreign code can be executed
    this._entryModule = this._initializeEntryModule(
      this.options.entryFilePath,
      this.options.entryModule
    )
  }

  /**
   * Execute foreign code in sandbox.
   *
   * @param {string|function} scriptContents
   * @returns {*}
   */
  executeScript (scriptContents: Function | string): any {
    // Serialize passed function
    if (typeof scriptContents === 'function') {
      scriptContents = scriptContents.toString() + '()'
    }

    return this._entryModule.exports(scriptContents)
  }

  /**
   * Require module in sandbox.
   *
   * @param {string} filePath
   * @param {Module|object} [parentModule]
   * @returns {*}
   */
  requireModule (filePath: string, parentModule: Module = this._entryModule): any {
    // Return mocked module for sandbox
    if (filePath in this.options.modules) {
      return this.options.modules[filePath]
    }

    // Load built-in module, when it is available
    if (Module.builtinModules.indexOf(filePath) !== -1) {
      return require(filePath)
    }

    // Resolve script file path
    const resolvedFilePath = this._resolveFilePath(filePath, parentModule)

    // Handle case, when file is not found
    // TODO: Make it node'ish
    if (resolvedFilePath === null) {
      throw new Error(`require: couldn\'t find "${filePath}" from "${module.filename}"`)
    }

    // Load module from cache
    if (this._modulesCache[resolvedFilePath]) {
      return this._modulesCache[resolvedFilePath].exports
    }

    // Initialize new module from this file, and return its exposed value
    return this._initializeModule(resolvedFilePath, parentModule).exports
  }

  /**
   * Inject mocked 'require' function into selected module.
   *
   * @param {Module|object} module
   * @private
   */
  private _injectRequireFunctionToModule (module: Module): void {
    module.require = filePath => this.requireModule(filePath, module)
  }

  /**
   * Resolve script file path.
   *
   * @param {string} filePath
   * @param {Module|object} parentModule
   * @returns {string|null}
   * @private
   */
  private _resolveFilePath (filePath: string, parentModule: Module): string | null {
    // Initialize cache data
    // @ts-ignore
    const cacheIdentifier = `${parentModule.path}\x00${filePath}`
    const cacheFilePath = this._filePathsCache[cacheIdentifier]

    // Return data from cache if it's available
    if (cacheFilePath) {
      return cacheFilePath
    }

    // Resolve script file path
    const fs = this.options.requireFileSystem
    const resolvedFilePath = resolveFilePath(filePath, parentModule, [ '.js', '.json' ], fs)

    // Cache file path if it exists
    if (resolvedFilePath !== null) {
      this._filePathsCache[cacheIdentifier] = resolvedFilePath
    }

    return resolvedFilePath
  }

  /**
   * Create new module object, without compilation.
   *
   * @param {string} filePath
   * @param {Module|object} parentModule
   * @returns {Module}
   * @private
   */
  private _createModuleObject (filePath: string, parentModule: Module): Module {
    // Initialize new module
    const ModuleConstructor = parentModule.constructor as typeof Module
    const childModule = new ModuleConstructor(__filename)

    // Set-up its data
    childModule.id = filePath
    childModule.paths = parentModule.paths
    childModule.parent = parentModule
    // @ts-ignore
    childModule.path = path.dirname(filePath)
    childModule.filename = path.basename(filePath)

    // Inject internal 'require' function
    this._injectRequireFunctionToModule(childModule)

    return childModule
  }

  /**
   * Initialize entry module, to run foreign code.
   *
   * @param {string} entryFilePath
   * @param {Module|object} parentModule
   * @returns {Module}
   * @private
   */
  private _initializeEntryModule (entryFilePath: string, parentModule: Module): Module {
    // Initialize new module
    const childModule = this._createModuleObject(entryFilePath, parentModule)

    // Expose evaluation code
    // @ts-ignore
    childModule._compile('module.exports = function (code) { return eval(code); }', entryFilePath)

    return childModule
  }

  /**
   * Initialize new module for selected script path.
   *
   * @param {string} filePath
   * @param {Module|object} parentModule
   * @returns {Module}
   * @private
   */
  private _initializeModule (filePath: string, parentModule: Module): Module {
    // Initialize new module
    const childModule = this._createModuleObject(filePath, parentModule)

    // Cache module
    this._modulesCache[filePath] = childModule

    // Compile code
    if (!/\.(?:js|json)$/.test(filePath)) {
      // @ts-ignore
      childModule.load(filePath)
    } else {
      // @ts-ignore
      childModule._compile(this._getScriptContents(filePath), filePath)
    }

    return childModule
  }

  /**
   * Get script contents, based on file type and current FS.
   *
   * @param {string} filePath
   * @returns {string}
   * @private
   */
  private _getScriptContents (filePath: string): string {
    // Read original file contents
    const originalContents = stripBom(this.options.requireFileSystem.readFileSync(filePath, 'utf8'))

    // Validate (with error thrown) and export JSON file
    if (/\.json$/.test(filePath)) {
      return `module.exports = ${JSON.stringify(JSON.parse(originalContents))}`
    }

    return originalContents
  }
}

export {
  NodeModuleSandbox
}
