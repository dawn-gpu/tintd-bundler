import {spawn} from 'child_process';

export function execute(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {...options || {}, shell: true});
    let stdout = [];
    let stderr = [];

    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', function(data) {
        const str = data.toString();
        const lines = str.split(/(\r?\n)/g);
        stdout = stdout.concat(lines);
    });

    proc.stderr.setEncoding('utf8');
    proc.stderr.on('data', function(data) {
        const str = data.toString();
        const lines = str.split(/(\r?\n)/g);
        stderr = stderr.concat(lines);
    });

    proc.on('close', function(code) {
      const result = {exitCode: code, stdout: stdout.join('\n'), stderr: stderr.join('\n')};
      if (parseInt(code) !== 0) {
        console.error(result.stderr);
        reject(result);
      } else {
        resolve(null, result);
      }
    });
  });
}
