const pino = require('pino');

module.exports = pino({ name: 'react-app', level: 'debug', safe: true });
