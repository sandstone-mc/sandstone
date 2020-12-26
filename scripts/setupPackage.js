const fs = require('fs')

// DO NOT DELETE THIS FILE
// This file is used by build system to build a clean npm package with the compiled js files in the root of the package.
// It will not be included in the npm package.
rootDir = __dirname + '/..'
distDir = rootDir + '/dist'

/*
Copies the root package.json but removes the scripts and dev dependencies which are not needed in the package.
It also fixes the main entry point to the package.
*/
const source = fs.readFileSync(__dirname + "/../package.json").toString('utf-8');
const sourceObj = JSON.parse(source);
sourceObj.scripts = {};
sourceObj.devDependencies = {};
if (sourceObj.main.startsWith("dist/")) {
    sourceObj.main = sourceObj.main.slice(9);
}
if (sourceObj.types.startsWith("dist/")) {
    sourceObj.types = sourceObj.types.slice(9);
}

// Remove sandstone from dependencies
delete sourceObj.dependencies.sandstone

fs.writeFileSync(distDir + "/package.json", Buffer.from(JSON.stringify(sourceObj, null, 2), "utf-8"));
fs.writeFileSync(distDir + "/version.txt", Buffer.from(sourceObj.version, "utf-8"));
fs.copyFileSync(rootDir + '/README.md', distDir + '/README.md')
fs.copyFileSync(rootDir + '/LICENSE', distDir + '/LICENSE')
fs.copyFileSync(rootDir + '/tsconfig.json', distDir + '/.tsconfig.json')
