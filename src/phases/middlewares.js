const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');

const logger = require('../lib/logger');

module.exports = function phase(done) {
  // Compress everything.
  this.use(compression());

  // Debugger.
  this.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: {
      write: (message) => {
        logger.debug(message.replace(/\n$/, ''));
      }
    }
  }));

  // Security headers.
  this.use(helmet.hsts({ maxAge: 31536000000 }));
  this.use(helmet.xssFilter());
  this.use(helmet.noSniff());
  this.use(helmet.hidePoweredBy());

  // Body parsing.
  this.use(bodyParser.json());
  this.use(bodyParser.urlencoded({ extended: false }));

  done();
};
