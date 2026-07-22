const AdmZip = require('adm-zip');
const { mkdir } = require('fs/promises');
const { tmpdir } = require('os');
const path = require('path');
const { readFromStorage, extractZipFiles } = require('./storage');
const { startScan, formatResults } = require('./scan');

const processJob = async (message, channel) => {
  const baseScanFolder = path.join(tmpdir(), 'scans');
  let scanPath;
  console.log('Processing job');
  
  try {
    const messagePayload = JSON.parse(message.content.toString('utf8'));

    scanPath = path.join(baseScanFolder, `${messagePayload.id}`);
    await mkdir(scanPath, { recursive: true });

    const zipBuffer = await readFromStorage('PENDING', messagePayload.s3_path);
    
    const zip = new AdmZip(zipBuffer);
    zip.extractAllTo(scanPath);

    console.log('Starting semgrep scan...');
    const rawResults = startScan(scanPath);
    const resultSummary = formatResults(messagePayload.id, rawResults, scanPath);

    const decision = resultSummary.mediumImpactCount > 0 || resultSummary.highImpactCount > 0 ?
      'REJECTED' :
      'PASSED';

    await updateFileUpload(messagePayload.id, resultSummary.findings, decision);
  
    console.log('Job successfully finished');
    channel.ack(message);
  } catch(err) {
    console.error("Unxpected worker error:", err);
    // TODO: be smarter about this - certain errors we may want to requeue
    channel.nack(message, false, false);
  } finally {
    // TODO: clean up temp scanPath - check not undefined.
    // Could clean up whole baseScanFolder in event that old scans 
    // floating around
  }
};

const updateFileUpload = async (id, findings, decision) => {
  // TODO: move to envars
  try {
    const response = await fetch('http://api:8000/upload/', {
      method: 'PATCH',
      body: JSON.stringify({
        id,
        // TODO: mock/hardcoded for now
        findings: findings,
        status: decision,
        scanned_at: new Date()
      }),
      headers: {
        'X-Internal-Api-Token': process.env.INTERNAL_API_TOKEN
      }
    });

    if (response.status < 200 || response.status > 299) throw new Error(`Update failed: ${response.status}`); 
  } catch(err) {
    // TODO: add custom error
    throw err;
  }
};

module.exports = {
  processJob
};
