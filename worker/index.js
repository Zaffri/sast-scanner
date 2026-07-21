const amqp = require('amqplib');

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

const processJob = (message, channel) => {
  try {
    console.log('Processing job');
  
    const messagePayload = JSON.parse(message.content.toString('utf8'));
    console.log(messagePayload);

    const result = mockResults();

    if (result.status === 'ERROR') throw new Error('Mock error');

    // TODO: handle pass/fail (summarise findings)
  
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

  if (result < 50) return { status: 'PASS' }; 
  if (result < 85) return { status: 'FAIL' };
  return { status: 'ERROR' };
};

start()
  .then(() => console.log('Worker started...'))
  .catch((err) => console.error('Worker failed:', err));
