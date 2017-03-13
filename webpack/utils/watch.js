import nodemon from 'nodemon';
import { createLogger } from './logger';

module.exports.watch = (opt) => {
  const logger = createLogger('nodemon');
  const script = nodemon({
    exec: 'babel-node',
    ...opt
  });

  const exitHandler = (options) => {
    if (options.exit) {
      script.emit('exit');
    }

    process.exit(0);
  };

  process.once('exit', exitHandler.bind(null, { exit: true }));
  process.once('SIGINT', exitHandler.bind(null, { quit: true }));

  script.on('log', (log) => {
    // Hack to not show the version number.
    if (log.message.length < 10) {
      return;
    }

    const message = log.message.charAt(0).toUpperCase() + log.message.slice(1);
    if (log.type === 'info' || log.type === 'status') {
      logger.info(`${message}`);
    } else {
      logger.debug(`${message}`);
    }
  });
  return script;
};
