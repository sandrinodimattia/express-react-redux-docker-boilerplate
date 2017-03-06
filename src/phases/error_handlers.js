const errors = require('../lib/errors');
const logger = require('../lib/logger');

module.exports = function phase() {
  this.use((err, req, res, next) => {
    logger.error(err);

    if (err instanceof errors.ValidationError) {
      return res.status(err.status).json({
        error_code: err.code,
        error_description: err.message
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({
        error_code: 'internal_server_error',
        error_description: 'An internal server error occured',
        error: err
      });
    }

    return res.status(500).json({
      error_code: 'internal_server_error',
      error_description: 'An internal server error occured'
    });
  });
};
