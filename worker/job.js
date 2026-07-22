const AdmZip = require('adm-zip');
const { mkdir } = require('fs/promises');
const { tmpdir } = require('os');
const path = require('path');
const { readFromStorage, extractZipFiles } = require('./storage');
const { startScan } = require('./scan');

const processJob = async (message, channel) => {
  const baseScanFolder = path.join(tmpdir(), 'scans');
  let scanPath;
  console.log('Processing job');
  
  try {
    const messagePayload = JSON.parse(message.content.toString('utf8'));
    console.log(messagePayload);

    scanPath = path.join(baseScanFolder, `${messagePayload.id}`);
    console.log({ scanPath });

    await mkdir(scanPath, { recursive: true });

    const zipBuffer = await readFromStorage('PENDING', messagePayload.s3_path);
    
    // extractZipFiles(zipBuffer);
    const zip = new AdmZip(zipBuffer);
    zip.extractAllTo(scanPath);

    // TODO: remove mock results and scan these
    startScan(scanPath);
    const result = mockResults();

    if (result.status === 'ERROR') throw new Error('Mock error');

    // TODO: handle pass/fail (summarise findings)
    await updateFileUpload(messagePayload.id, result);
  
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

// TODO: temp only until adding AST parser
const mockResults = () => {
  const result = Math.random() * 100;

  if (result < 50) return {
    status: 'PASSED',
    findings: [
      { name: 'CHECK_TWO', severity: 'LOW' }
    ]
  };
 
  if (result < 85) return {
    status: 'REJECTED',
    findings: [
      { name: 'CHECK_ONE', severity: 'HIGH' },
      { name: 'CHECK_THREE', severity: 'MEDIUM' },
    ]
  };
  return { status: 'ERROR', findings: [] };
};

const updateFileUpload = async (id, result) => {
  // TODO: move to envars
  try {
    const response = await fetch('http://api:8000/upload/', {
      method: 'PATCH',
      body: JSON.stringify({
        id,
        // TODO: mock/hardcoded for now
        findings: result.findings,
        status: result.status,
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
