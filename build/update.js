import path from 'path';
import fs from 'fs';

import {execute} from './execute.js';
    
const cwd = process.cwd(); 

async function main() {
  try {
    await execute('git', ['submodule', 'update', '--init']);
    process.chdir('third_party/dawn');
    await execute('git', ['pull', 'origin', 'main']);
    process.chdir(cwd);
    process.chdir('third_party/depot_tools');
    await execute('git', ['pull', 'origin', 'main']);
   } catch (e) {
    console.error(e);
    console.error(e.stack);
    process.exit(1);
  }
}

main();