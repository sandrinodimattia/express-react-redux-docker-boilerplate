const http = require('http');
const enableDestroy = require('server-destroy');

const logger = require('../lib/logger');

module.exports = function phase(done) {
  if (process.env.NODE_ENV === 'test') {
    return done();
  }

  const app = this;
  const server = http.createServer(app);
  enableDestroy(server);

  const timeout = fn => setTimeout(fn, 10000);
  const shutdown = () => {
    server.destroy(() => {
      logger.info('Shutting down server.');
      process.exit(0);
    });

    timeout(() => {
      logger.warn('Could not shutdown server in time. Forcing shutdown.');
      process.exit(0);
    });
  };

  process
    .on('SIGINT', shutdown)
    .on('SIGTERM', shutdown);

  try {
    const port = process.env.PORT || 3000;
    return server.listen(port, (err) => {
      if (err) {
        return done(err);
      }

      logger.info(`Express listening on http://localhost:${port}`);
      return done();
    });
  } catch (e) {
    return done(e);
  }
};
