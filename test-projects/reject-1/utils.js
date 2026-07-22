const run = () => {
  // console.log("Run this...")
  const hiddenCode = 'Y29uc29sZS5sb2coIlJ1biB0aGlzLi4uIik=';
  eval(Buffer.from(hiddenCode, 'base64').toString());
};

const logger = {
  info: console.log
};

module.exports = { run, logger };
