import fs from 'fs';

const filename = process.argv[2];
const pkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf8'}));
const vsPkg = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
const newPkg = {
  ...pkg,
  ...vsPkg,
  version: pkg.version,
};
fs.writeFileSync(filename, JSON.stringify(newPkg, null, 2));
