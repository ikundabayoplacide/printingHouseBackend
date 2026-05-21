const Permission = require('../database/models/Permission');
const RolePermission = require('../database/models/RolePermission');
const { success, error } = require('../utils/apiResponse');
const { clearPermissionCache, getPermissionsForRole } = require('../utils/permissions');

/**
 * GET /api/permissions
 * Get all permissions.
 */
const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.findAll({ order: [['resource', 'ASC'], ['action', 'ASC']] });
    return success(res, permissions);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/permissions
 * Create a new permission (ADMIN only).
 */
const createPermission = async (req, res, next) => {
  try {
    const { resource, action, description } = req.body;
    const name = `${resource.trim().toLowerCase()}.${action.trim().toLowerCase()}`;

    const existing = await Permission.findOne({ where: { name } });
    if (existing) return error(res, `Permission "${name}" already exists.`, 409);

    const permission = await Permission.create({ name, resource: resource.trim().toLowerCase(), action: action.trim().toLowerCase(), description: description || null });
    return success(res, permission, 'Permission created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/permissions/:id
 * Update a permission (ADMIN only).
 */
const updatePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return error(res, 'Permission not found.', 404);

    const { description } = req.body;
    await permission.update({ ...(description !== undefined && { description }) });
    return success(res, permission, 'Permission updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/permissions/:id
 * Delete a permission (ADMIN only).
 */
const deletePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return error(res, 'Permission not found.', 404);

    await RolePermission.destroy({ where: { permissionId: req.params.id } });
    await permission.destroy();
    clearPermissionCache();

    return success(res, null, 'Permission deleted successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/permissions/role/:role
 * Get all permissions for a specific role.
 */
const getRolePermissions = async (req, res, next) => {
  try {
    const { role } = req.params;
    const validRoles = ['ADMIN', 'RECEPTIONIST', 'SALES', 'DAF', 'ACCOUNTANT', 'PRODUCTION_MANAGER', 'STOCK', 'SUPERVISOR', 'WORKER'];
    if (!validRoles.includes(role)) return error(res, 'Invalid role.', 400);

    const permissions = await getPermissionsForRole(role);
    return success(res, { role, permissions });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/permissions/my
 * Get permissions for the currently authenticated user's role.
 */
const getMyPermissions = async (req, res, next) => {
  try {
    const permissions = await getPermissionsForRole(req.user.role);
    return success(res, { role: req.user.role, permissions });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/permissions/role/:role
 * Grant a permission to a role (ADMIN only).
 */
const grantPermission = async (req, res, next) => {
  try {
    const { role } = req.params;
    const { permissionId } = req.body;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) return error(res, 'Permission not found.', 404);

    const existing = await RolePermission.findOne({ where: { role, permissionId } });
    if (existing) return error(res, 'Role already has this permission.', 409);

    await RolePermission.create({ role, permissionId });
    clearPermissionCache();

    return success(res, { role, permission: permission.name }, 'Permission granted successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/permissions/role/:role/:permissionId
 * Revoke a permission from a role (ADMIN only).
 */
const revokePermission = async (req, res, next) => {
  try {
    const { role, permissionId } = req.params;

    const rolePermission = await RolePermission.findOne({ where: { role, permissionId } });
    if (!rolePermission) return error(res, 'Permission not found for this role.', 404);

    await rolePermission.destroy();
    clearPermissionCache();

    return success(res, null, 'Permission revoked successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/permissions/role/:role
 * Replace all permissions for a role (ADMIN only).
 */
const setRolePermissions = async (req, res, next) => {
  try {
    const { role } = req.params;
    const { permissionIds } = req.body;

    if (!Array.isArray(permissionIds)) return error(res, 'permissionIds must be an array.', 400);

    // Validate all permission IDs exist
    const permissions = await Permission.findAll({ where: { id: permissionIds } });
    if (permissions.length !== permissionIds.length) {
      return error(res, 'One or more permission IDs are invalid.', 400);
    }

    // Replace all permissions for this role
    await RolePermission.destroy({ where: { role } });
    await RolePermission.bulkCreate(
      permissionIds.map((permissionId) => ({ role, permissionId }))
    );

    clearPermissionCache();

    const updated = await getPermissionsForRole(role);
    return success(res, { role, permissions: updated }, 'Role permissions updated successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllPermissions, createPermission, updatePermission, deletePermission, getRolePermissions, getMyPermissions, grantPermission, revokePermission, setRolePermissions };
