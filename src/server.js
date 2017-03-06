const path = require('path');
const express = require('express');

const logger = require('./lib/logger');
const bootable = require('./lib/bootable');

const app = bootable(express(), path.join(__dirname, 'phases'));
app.phase('views');
app.phase('middlewares');
app.phase('assets');
app.phase('routes');
app.phase('error_handlers');
app.phase('listen');

process.on('uncaughtException', (err) => {
  logger.error(err, `Uncaught Exception: ${err.message}`);
  process.exit(1);
});

if (require.main === module) {
  app.boot((err) => {
    if (err) {
      logger.error(err, 'Error booting server');
      process.exit(1);
    }
  });
}

module.exports = app;
