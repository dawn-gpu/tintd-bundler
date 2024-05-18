import path from 'path';
import fs from 'fs';

import {execute} from './execute.js';
import * as github from './github.js';

const owner = 'greggman';
const repo = 'tintd-bundler';

function executeL(cmd, args) {
  console.log(cmd, args.join(' '));
  execute(cmd, args);
}

async function downloadFile(name, url, filepath) {
  const res = await fetch(url);
  const data = await res.arrayBuffer();
  const filename = path.join(filepath, name);
  console.log('download:', filename);
  fs.mkdirSync(filepath, {recursive: true});
  fs.writeFileSync(filename, new Uint8Array(data));
  return filename;
}

async function main() {
  const data = await github.getLatestRelease({
    owner,
    repo,
  });
  const vsixFilenames = await Promise.all(
    data.assets
      .filter(({name}) => name?.endsWith('.vsix'))
      .map(({name, browser_download_url}) => downloadFile(name, browser_download_url, 'dist'))
  );
  executeL('./node_modules/.bin/vsce', ['publish', '--packagePath', ...vsixFilenames]);
}

main();