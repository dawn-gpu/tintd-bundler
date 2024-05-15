import fs from 'fs';

export function exists(filename) {
  try {
    fs.statSync(filename);
    return true;
  } catch {
    return false;
  }
}
