const { exec } = require('node:child_process');

const run = () => {
  // console.log("Run this...")
  const hiddenCode = 'Y29uc29sZS5sb2coIlJ1biB0aGlzLi4uIik=';
  eval(Buffer.from(hiddenCode, 'base64').toString());
};

const logger = {
  info: console.log
};

function testCommandInjection(req, res) {
  const target = req.query.host;
  exec(`ping -c 1 ${target}`, (err, stdout) => {
    res.send(stdout);
  });
}

function testWeakCrypto(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

function testPrototypePollution(reqBody) {
    const target = {};
    const source = reqBody;
    
    target.__proto__.isAdmin = source.isAdmin;
}

module.exports = { run, logger };
