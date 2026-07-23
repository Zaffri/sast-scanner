const AdmZip = require('adm-zip');
const { mkdir, rm } = require('fs/promises');
const { tmpdir } = require('os');
const path = require('path');
const { readFromStorage } = require('./storage');
const { startScan, formatResults } = require('./scan');

const QUEUE_NAME = 'pending_uploads';

const processJob = async (message, channel, scanDurationHistogram) => {
  console.log('Processing job');
  // TODO: revisit this
  // const endScanTimer = scanDurationHistogram.startTimer({ queue: QUEUE_NAME });

  const baseScanFolder = path.join(tmpdir(), 'scans');
  let scanPath;
  
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
    await clearScanFolder(baseScanFolder);
    // endScanTimer();
  }
};

const clearScanFolder = async (baseScanFolder) => {
  try {
    // delete whole baseScanFolder folder (its recreated) - clear any previous floating uploads
    await rm(baseScanFolder, { 
      recursive: true, 
      force: true
    });
  } catch(err) {
    console.error('Failed to clear scan folder', err);
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
  processJob,
  QUEUE_NAME
};
