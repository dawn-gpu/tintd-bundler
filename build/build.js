import path from 'path';
import fs from 'fs';

import {execute} from './execute.js';
import {appendPathIfItExists, prependPathIfItExists} from './utils.js';
    
//const __dirname = dirname(fileURLToPath(import.meta.url));
const g_cwd = process.cwd(); 
const g_depotToolsPath = path.join(g_cwd, 'third_party', 'depot_tools');
const g_buildDir = path.resolve('out/cmake-release').replaceAll('\\', '/');
const g_resultPath = `${g_buildDir}/gen/vscode`;

prependPathIfItExists(g_depotToolsPath);
appendPathIfItExists('/Applications/CMake.app/Contents/bin');
appendPathIfItExists('C:\\Program Files\\CMake\\bin');

function fixupPackageJson(filename) {
  const pkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'}));
  const vsPkg = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
  const newPkg = {
    ...pkg,
    ...vsPkg,
    type: "commonjs",
    scripts: {},
    version: pkg.version,
    publisher: 'gfx-tintd',
    icon: 'tintd-128x128.png',
  };
  fs.writeFileSync(filename, JSON.stringify(newPkg, null, 2));
}

// Not sure I should edit this way but the file is in some undefined format. It's not JSON.
function addDotGClient() {
  const s = fs.readFileSync('scripts/standalone.gclient', { encoding: 'utf-8' });
  const newS = s.replace('"managed": False,', `\
    "managed": False,
    "custom_vars": {
      "dawn_tintd": True,
    },
  `);
  fs.writeFileSync('.gclient', newS);
}

async function buildTintD() {
  try {
    process.env.DEPOT_TOOLS_WIN_TOOLCHAIN = '0'
    process.chdir('third_party/dawn');
    addDotGClient();
    await execute('gclient', ['metrics', '--opt-out']);
    await execute('gclient', ['sync', '-D']);
    fs.mkdirSync(g_buildDir, {recursive: true});

    await execute('cmake', [
      '-S', '.',
      '-B', g_buildDir,
      '-DTINT_BUILD_TINTD=1',
      '-DCMAKE_BUILD_TYPE=RelWithDebInfo',
    ]);
    process.chdir(g_buildDir);
    if (process.platform === 'win32') {
      await execute('msbuild', ['-m', '-p:Configuration=Release','-t:tint_cmd_tintd_cmd', 'dawn.sln']);
      const extensionJsPath = path.join('gen', 'vscode', 'extension.js');
      const extension = fs.readFileSync(extensionJsPath, {encoding: 'utf8'});
      // Hack extension.js until it's fixed upstream.
      const newExtension = extension.replace(", 'tintd');", ", 'Release', 'tintd.exe');");
      fs.writeFileSync(extensionJsPath, newExtension);
    } else {
      await execute('make', ['tint_cmd_tintd_cmd']);
    }
  } finally {
    process.chdir(g_cwd);
  }
}

async function packageExtension(target) {
  try {
    process.chdir(g_resultPath);
    await execute('npm', ['install']);
    await execute(`${g_cwd}/node_modules/.bin/vsce`, [
      'package',
      '--allow-star-activation',
      '--target', target,
    ]);
  } finally {
    process.chdir(g_cwd);
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
    fixupPackageJson(`${g_resultPath}/package.json`);
    fs.copyFileSync('third_party/dawn/LICENSE', `${g_resultPath}/LICENSE`);
    fs.copyFileSync('EXT-README.md', `${g_resultPath}/README.md`);
    fs.copyFileSync('resources/images/tintd-128x128.png', `${g_resultPath}/tintd-128x128.png`);
    await packageExtension(target);
    const packageName = await copyPackage(g_resultPath, target);
    console.log('created:', packageName);
  } catch (e) {
    console.error(e);
    console.error(e.stack);
    process.exit(1);
  }
}

main();
