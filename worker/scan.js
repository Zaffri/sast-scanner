const { execFile, exec, execFileSync } = require('child_process');

const MAX_SIZE = 1024 * 1024 * 25; // 50MB
const TIMOUT_IN_MS = 180000; // 3 min

/** @typedef {import('semgrep-types').SemgrepReport} SemgrepReport */
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

    /** @type {SemgrepReport} */
    const results = JSON.parse(stdout);
    return results;
  } catch(err) {
    // TODO: add custom error
    console.error('SEMGREP SCAN ERROR');
    throw err;
  }
};

/**
 * @typedef {Object} Finding
 * @property {number} upload_id
 * @property {string} check_name
 * @property {string} impact_severity
 * @property {string} found_in_file
 */

/**
 * @typedef {Object} ResultsSummary
 * @property {Finding[]} findings
 * @property {number} highImpactCount
 * @property {number} mediumImpactCount
 * @property {number} lowImpactCount
 */

const formatResults = (uploadId, /** @type {SemgrepReport} */ rawResults, scanPath) => {
  if (rawResults.errors.length) console.log('Semgrep errors:', rawResults.errors);
  
  if (!rawResults.results) {
    console.log('No semgrep results');
    return {
      findings: [],
      highImpactCount: 0,
      mediumImpactCount: 0,
      lowImpactCount: 0,
    };
  };

  /** @type {ResultsSummary} */
  const resultsSummary = {
    findings: [],
    highImpactCount: 0,
    mediumImpactCount: 0,
    lowImpactCount: 0,
  };

  return rawResults.results.reduce((acc, finding) => {
    const impact = finding.extra.metadata?.impact ?? 'UNKNOWN';
  
    if (impact === 'HIGH') acc.highImpactCount += 1;
    if (impact === 'MEDIUM') acc.mediumImpactCount += 1;
    if (impact === 'LOW') acc.lowImpactCount += 1;

    acc.findings.push({
      upload_id: uploadId,
      check_name: finding.check_id,
      impact_severity: finding.extra.metadata?.impact ?? 'UNKNOWN',
      found_in_file: finding.path.replace(scanPath, '')
      // TODO: add line start/end
    });
    
    return acc;
  }, resultsSummary);
};

module.exports = { startScan, formatResults };
