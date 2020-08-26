const fs = require('fs');

// DO NOT DELETE THIS FILE
// This file is used by build system to clean the dist folder before packaging.

distDir = __dirname + '/../dist'

fs.rmdirSync(distDir, { recursive: true })