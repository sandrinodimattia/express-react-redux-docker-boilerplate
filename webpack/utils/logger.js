const pino = require('pino');

module.exports.createLogger = name => pino({
  name,
  level: 'debug',
  prettyPrint: process.env.NODE_ENV !== 'production',
  safe: true
});
