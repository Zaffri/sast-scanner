const amqp = require('amqplib');
const { readFromStorage, extractZipFiles } = require('./storage');

const QUEUE_NAME = 'pending_uploads';

const start = async() => {
  console.log('Starting worker...');

  // TODO: get from env
  const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');

  connection.on('error', (err) => {
    console.error('RabbitMQ connection error:', err);
  });
  
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  channel.consume(QUEUE_NAME, (message) => {
    processJob(message, channel);
  }, { noAck: false });
};

const processJob = async (message, channel) => {
  try {
    console.log('Processing job');
  
    const messagePayload = JSON.parse(message.content.toString('utf8'));
    console.log(messagePayload);

    const zipBuffer = await readFromStorage('PENDING', messagePayload.s3_path);
    // TODO: remove mock results and scan these
    extractZipFiles(zipBuffer);

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

start()
  .then(() => console.log('Worker started...'))
  .catch((err) => console.error('Worker failed:', err));
