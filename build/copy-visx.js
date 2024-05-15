import fs from 'fs';
import path from 'path';

const filepath = process.argv[2];
const target = process.argv[3];
const pkg = JSON.parse(fs.readFileSync(`${filepath}/package.json`, {encoding: 'utf8'}));
const srcFilename = path.join(filepath, `${pkg.name}-${target}-${pkg.version}.vsix`);
const dstFilename = path.join('dist', path.basename(srcFilename));
fs.copyFileSync(srcFilename, dstFilename);
