# Bestest - benchmarking tooling

[![CircleCI](https://circleci.com/gh/rangoo94/bestest.svg?style=svg)](https://circleci.com/gh/rangoo94/bestest)
[![Maintainability](https://api.codeclimate.com/v1/badges/0d074d953394b18ecae9/maintainability)](https://codeclimate.com/github/rangoo94/bestest/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0d074d953394b18ecae9/test_coverage)](https://codeclimate.com/github/rangoo94/bestest/test_coverage)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Work in progress...

## To do list

- [x] **[Task scheduling](packages/task-schedulement):** to set-up different methods for scheduling tasks (on different environments)
- [x] **[Time measurement](packages/time-measurement):** to set-up different methods to estimate current time (on different environments)
- [x] **[Function performance measurement](packages/execution):** to run simple benchmarks against function, getting information about execution time or ops/sec
- [x] **[Detect environment information](packages/detect-environment):** to gather information for current environment
- [x] **[File system](packages/fs):** to allow in-memory computations in compiler
- [x] **[Compiler](packages/compiler):** to prepare code for use
- [x] **[Statistics & formatting utils](packages/math):** to consume function performance information
- [x] **[Node.js execution sandbox](packages/node-module-sandbox):** to run test code in memory sand-boxed environment, with possibility to mock file system
- [x] **[Runner](packages/runner):** run code on different environments automatically
- [ ] **Output tools:** output benchmark results in many different ways (HTML, SVG, console)
- [ ] **Core:** core tooling: test suites and cases, and their factories
- [ ] **Bestest itself:** to combine all utils 
- [ ] **CLI:** Simple CLI interface for Bestest tool
- [ ] **Unit tests:** with Mocha and Wallaby
- [ ] **Examples**
- [ ] **Documentation**
- [ ] **Different compilers:** already existing: [Webpack](packages/compiler-webpack), [transparent](packages/compiler-none) one
- [ ] **Different output tools:** none yet
- [ ] **Different environment runners:** already existing: [local](packages/runner-local)
- [ ] **Check on Windows machines**
