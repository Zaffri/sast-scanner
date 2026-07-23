const amqp = require('amqplib');
const client = require('prom-client');
const http = require('http');
const { processJob, QUEUE_NAME } = require('./job');

const start = async() => {
  console.log('Starting worker...');

  setupMetricsServer();

  const scanDurationHistogram = new client.Histogram({
    name: 'scan_processing_duration_seconds',
    help: 'Duration of scan processing in seconds',
    labelNames: ['queue'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60]
  });

  // TODO: get from env
  const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');

  connection.on('error', (err) => {
    console.error('RabbitMQ connection error:', err);
  });
  
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  channel.consume(QUEUE_NAME, (message) => {
    processJob(message, channel, scanDurationHistogram);
  }, { noAck: false });
};

const setupMetricsServer = () => {
  http.createServer(async (req, res) => {
    if (req.url === '/metrics') {
      res.setHeader('Content-Type', client.register.contentType);
      res.end(await client.register.metrics());
    } else {
      res.statusCode = 404;
      res.end();
    }
  }).listen(9005); // TODO: get from env
};

start()
  .then(() => console.log('Worker started...'))
  .catch((err) => console.error('Worker failed:', err));
