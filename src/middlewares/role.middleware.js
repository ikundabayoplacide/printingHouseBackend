const { error } = require('../utils/apiResponse');

/**
 * Restrict access to specific roles
 * Usage: authorize('ADMIN', 'STAFF')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Unauthorized.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, `Forbidden. Your role "${req.user.role}" is not allowed. Required: [${roles.join(', ')}].`, 403);
    }

    next();
  };
};

module.exports = { authorize };
