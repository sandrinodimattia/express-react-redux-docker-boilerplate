const pino = require('pino');

module.exports = pino({
  name: 'react-app',
  level: 'debug',
  prettyPrint: process.env.NODE_ENV !== 'production',
  safe: true
});
