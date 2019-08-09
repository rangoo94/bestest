# @bestest/fs

Internal File System mechanism of Bestest benchmarking tool.
It may use either memory-only files, or fallback to root FS.
It allows also to set-up public path for files - it's needed to set-up server to serve static files for browser.

## Changelog

* **1.0.3** (on 2019-08-09): handle trailing slashes in `publicPathPrefix` option
* **1.0.1** (on 2019-08-09): expose memory-only FS and add public path prefix for configuration
* **1.0.0** (on 2019-08-09): initial version
