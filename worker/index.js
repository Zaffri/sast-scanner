const amqp = require('amqplib');
const { processJob } = require('./job');

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

start()
  .then(() => console.log('Worker started...'))
  .catch((err) => console.error('Worker failed:', err));
