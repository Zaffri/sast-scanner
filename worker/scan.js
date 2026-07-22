const { execFile, exec, execFileSync } = require('child_process');

const MAX_SIZE = 1024 * 1024 * 25; // 50MB
const TIMOUT_IN_MS = 180000; // 3 min

const startScan = (targetPath) => {
  try {
    const stdout = execFileSync('semgrep', [
      'scan',
      '--json',
      '--config',
      'auto',
      '--metrics',
      'on',
      targetPath
    ], {
      maxBuffer: MAX_SIZE,
      timeout: 120000
    });

    const results = JSON.parse(stdout);
    console.log({ semgrepResults: JSON.stringify(results) });
  } catch(err) {
    // TODO: add custom error
    console.error('SEMGREP SCAN ERROR');
    throw err;
  }
};

module.exports = { startScan };
