const { roleHasPermission } = require('../utils/permissions');
const { error } = require('../utils/apiResponse');

/**
 * Middleware to check if the authenticated user's role has a specific permission.
 * Usage: requirePermission('jobs.create')
 */
const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return error(res, 'Unauthorized.', 401);

      const hasPermission = await roleHasPermission(req.user.role, permissionName);
      if (!hasPermission) {
        return error(res, `Forbidden. You do not have permission to perform this action (${permissionName}).`, 403);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { requirePermission };
