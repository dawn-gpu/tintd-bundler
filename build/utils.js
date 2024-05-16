import fs from 'fs';
import path from 'path';

export function exists(filename) {
  try {
    fs.statSync(filename);
    return true;
  } catch {
    return false;
  }
}

export function prependPathIfItExists(filepath) {
  if (exists(filepath)) {
    process.env.PATH = `${filepath}${path.delimiter}${process.env.PATH}`;
  }
}

export function appendPathIfItExists(filepath) {
  if (exists(filepath)) {
    process.env.PATH = `${process.env.PATH}${path.delimiter}${filepath}`;
  }
}
