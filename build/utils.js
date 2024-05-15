import fs from 'fs';

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
    process.env.PATH = `${process.env.PATH}${path.delimiter}${filepath}`;
  }
}

export function appendPathIfItExists(filepath) {
  if (exists(filepath)) {
    process.env.PATH = `${process.env.PATH}${path.delimiter}${filepath}`;
  }
}
