class AppError extends Error {
  constructor(message, statusCode) {
    super();

    this.message = message;
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.operational = true;

    Error.captureStackTrace(this.constructor);
  }
}

module.exports = AppError;