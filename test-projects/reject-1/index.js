const { Buffer } = require('buffer');
const { run, logger } = require('./utils.js');

const getIndexHtml = (req, res) => {
  const search = req.query.search;
  run();
  res.send(`Term: ${search}`);
};

const getJs = (req, res) => {
  const input = req.query.input;
  run();
  res.send(`<script>document.getElementById('one').innerHtml = ${input}</script>`);
};

const handleSubmit = (req, res) => {
  logger.info(req.body);
  logger.info(req.headers);
  res.send('ok');
};
