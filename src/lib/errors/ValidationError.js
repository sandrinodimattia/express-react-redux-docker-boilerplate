function ValidationError(code, message) {
  Error.call(this, message);
  Error.captureStackTrace(this, this.constructor);
  this.name = 'ValidationError';
  this.code = code;
  this.message = message;
  this.status = 400;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;
module.exports = ValidationError;
