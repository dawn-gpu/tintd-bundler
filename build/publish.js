import { Octokit } from 'octokit';
import path from 'path';
import fs from 'fs';

const octokit = new Octokit({ });

const owner = 'greggman';
const repo = 'tintd-bundler';

function execute(cmd, args) {
  console.log(cmd, args.join(' '));
}

async function downloadFile(name, url, filepath) {
  const res = await fetch(url);
  const data = await res.arrayBuffer();
  const filename = path.join(filepath, name);
  console.log('download:', filename);
  fs.writeFileSync(filepath, new Uint8Array(data));
  return filename;
}

async function main() {
  const latest = await octokit.rest.repos.getLatestRelease({
    owner,
    repo,
  });
  const vsixFilenames = await Promise.all(
    latest.data.assets
      .filter(({name}) => name?.endsWith('.vsix'))
      .map(({name, browser_download_url}) => downloadFile(name, browser_download_url, 'dist'))
  );
  for (const filename of vsixFilenames) {
    execute('./node_modules/.bin/vsce', ['publish', '--packagePath', filename]);
  }
}

main();