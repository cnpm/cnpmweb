const path = require('node:path');
const { pathToFileURL } = require('node:url');

// tsrs has native binaries for Apple Silicon and 64-bit Linux.
// Use its WebAssembly compiler on other platforms, including Windows.
const hasNativeBinary =
  (process.platform === 'darwin' && process.arch === 'arm64') ||
  (process.platform === 'linux' && ['arm64', 'x64'].includes(process.arch));
const compiler = hasNativeBinary ? 'tsrs' : '@ts-rs/wasm';
const packagePath = require.resolve(`${compiler}/package.json`);
const { bin } = require(packagePath);

import(pathToFileURL(path.resolve(path.dirname(packagePath), Object.values(bin)[0])).href);
