const logger = require('../utils/logger');
const { error } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} | ${req.method} ${req.originalUrl}`, { stack: err.stack });

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return error(res, 'File too large. Maximum size allowed is 10MB.', 413);
  }

  // Multer file type error
  if (err.message && err.message.startsWith('Invalid file type')) {
    return error(res, err.message, 415);
  }

  // Prisma known request errors
  if (err.code === 'P2002') {
    return error(res, 'A record with this value already exists.', 409);
  }

  if (err.code === 'P2025') {
    return error(res, 'Record not found.', 404);
  }

  // Default
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return error(res, message, statusCode);
};

const notFound = (req, res) => {
  return error(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = { errorHandler, notFound };
