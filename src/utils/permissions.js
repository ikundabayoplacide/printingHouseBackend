const RolePermission = require('../database/models/RolePermission');
const Permission = require('../database/models/Permission');

/**
 * Get all permission names for a given role.
 * Results are cached in memory per role to avoid repeated DB queries.
 */
const permissionCache = {};

const getPermissionsForRole = async (role) => {
  if (permissionCache[role]) return permissionCache[role];

  const rolePerms = await RolePermission.findAll({
    where: { role },
    include: [{ model: Permission, as: 'permission', attributes: ['name'] }],
  });

  const names = rolePerms.map((rp) => rp.permission.name);
  permissionCache[role] = names;
  return names;
};

/**
 * Check if a role has a specific permission.
 */
const roleHasPermission = async (role, permissionName) => {
  const permissions = await getPermissionsForRole(role);
  return permissions.includes(permissionName);
};

/**
 * Clear the cache (call this when permissions are updated).
 */
const clearPermissionCache = () => {
  Object.keys(permissionCache).forEach((key) => delete permissionCache[key]);
};

module.exports = { getPermissionsForRole, roleHasPermission, clearPermissionCache };
