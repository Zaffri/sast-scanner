const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const AdmZip = require('adm-zip');

const MAX_ZIP_FILE_COUNT = 200;

const s3Client = new S3Client({
  region: 'garage',
  endpoint: 'http://object-store:3900',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.GARAGE_ACCESS_KEY,
    secretAccessKey: process.env.GARAGE_SECRET_KEY,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

const readFromStorage = async (status, path) => {
  try {
    const bucket = status === 'REJECTED' || status === 'PASSED' ?
    process.env.PROCESSED_BUCKET :
    process.env.PENDING_BUCKET;
    
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: path,
    });

    const response = await s3Client.send(command);
    const byteArray = await response.Body.transformToByteArray();
  
    return Buffer.from(byteArray);;
  } catch(err) {
    // TODO: add custom error 
    throw err;
  }
};

// const extractZipFiles = (zipBuffer) => {
//   try {
//     // TODO: need protection against zip bombs and general size limits (oom error)
//     const zip = new AdmZip(zipBuffer);
//     const numberOfFiles = zip.getEntryCount();

//     if (numberOfFiles > MAX_ZIP_FILE_COUNT) {
//       throw new Error(`Number of files ${numberOfFiles} exceeded max count ${MAX_ZIP_FILE_COUNT}`);
//     }

//     console.log('FIles found', numberOfFiles);
  
//     const files = zip.getEntries();

//     files.forEach(file => {
//       console.log(file.name);
//     });

//   } catch(err) {
//     // TODO: add custom error
//     throw err;
//   }
// };

module.exports = {
  // extractZipFiles,
  readFromStorage
};