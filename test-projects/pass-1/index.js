const { Buffer } = require('buffer');
const { run, logger } = require('./utils.js');

const getJs = (req, res) => {
  const input = req.query.input;
  run();
  res.send(`<script>document.getElementById('one').textContent = ${input}</script>`);
};

const handleSubmit = (req, res) => {
  logger.info('Received');
  res.send('ok');
};
