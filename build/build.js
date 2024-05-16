import path from 'path';
import fs from 'fs';

import {execute} from './execute.js';
import {appendPathIfItExists, prependPathIfItExists} from './utils.js';
    
//const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd(); 
const depotToolsPath = path.join(cwd, 'third_party', 'depot_tools');
const buildPath = 'third_party/dawn/out/cmake-release/gen/vscode'

prependPathIfItExists(depotToolsPath);
appendPathIfItExists('/Applications/CMake.app/Contents/bin');
appendPathIfItExists('C:\\Program Files\\CMake\\bin');

function fixupPackageJson(filename) {
  const pkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'}));
  const vsPkg = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
  const newPkg = {
    ...pkg,
    ...vsPkg,
    version: pkg.version,
  };
  fs.writeFileSync(filename, JSON.stringify(newPkg, null, 2));
}

async function buildTintD() {
  try {
    process.chdir('third_party/dawn');
    fs.copyFileSync('scripts/standalone.gclient', '.gclient');
    await execute('gclient', ['metrics', '--opt-out']);
    await execute('gclient', ['sync']);
    fs.mkdirSync('out/cmake-release', {recursive: true});

    await execute('cmake', [
      '-S', '.',
      '-B', 'out/cmake-release',
      '-DTINT_BUILD_TINTD=1',
      '-DCMAKE_BUILD_TYPE=RelWithDebInfo',
    ]);
    process.chdir('out/cmake-release');
    if (process.platform === 'win32') {
      await execute('msbuild', ['-m', '-t:tint_cmd_tintd_cmd', 'dawn.sln']);
    } else {
      await execute('make', ['-C', 'out/cmake-release', 'tintd']);
    }
  } finally {
    process.chdir(cwd);
  }
}

async function packageExtension(target) {
  try {
    process.chdir(buildPath);
    await execute('npm', ['i']);
    await execute(`${cwd}/node_modules/.bin/vsce`, [
      'package',
      '--allow-star-activation',
      '--target', target,
    ]);
  } finally {
    process.chdir(cwd);
  }
}

async function copyPackage(filepath, target) {
  const pkg = JSON.parse(fs.readFileSync(`${filepath}/package.json`, {encoding: 'utf8'}));
  const srcFilename = path.join(filepath, `${pkg.name}-${target}-${pkg.version}.vsix`);
  const dstFilename = path.join('dist', path.basename(srcFilename));
  fs.mkdirSync(path.dirname(dstFilename), {recursive: true});
  fs.copyFileSync(srcFilename, dstFilename);
  return dstFilename;
}

async function main() {
  try {
    const target = `${process.platform}-${process.arch}`;
    console.log('building for:', target);
    await execute('git', ['submodule', 'update', '--init']);
    await buildTintD();
    fixupPackageJson(`${buildPath}/package.json`);
    fs.copyFileSync('third_party/dawn/LICENSE', `${buildPath}/LICENSE`);
    await packageExtension(target);
    const packageName = await copyPackage(buildPath, target);
    console.log('created:', packageName);
  } catch (e) {
    console.error(e);
    console.error(e.stack);
    process.exit(1);
  }
}

main();
