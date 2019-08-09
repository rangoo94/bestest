"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var CompilerAdapter_1 = require("@bestest/compiler/lib/CompilerAdapter");
/**
 * Bestest Compiler adapter, which is completely transparent.
 * Used to always keep the same behavior, even if no compilation process is required.
 *
 * @class
 */
var DummyCompilerAdapter = /** @class */ (function (_super) {
    __extends(DummyCompilerAdapter, _super);
    function DummyCompilerAdapter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = '@bestest/compiler-none';
        _this.name = 'None';
        return _this;
    }
    /**
     * Compile code for use.
     *
     * @param {CompilerAdapterCompileOptionsInterface|object} options
     * @param {function(object|null, FileSystemInterface|object|null, string[])} callback
     */
    DummyCompilerAdapter.prototype.compile = function (options, callback) {
        callback(null, options.fs, options.entries);
    };
    return DummyCompilerAdapter;
}(CompilerAdapter_1.CompilerAdapter));
exports.DummyCompilerAdapter = DummyCompilerAdapter;
