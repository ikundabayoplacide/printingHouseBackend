const { sequelize } = require('../config/database');
const Role = require('../database/models/Role');
const User = require('../database/models/User');
const RolePermission = require('../database/models/RolePermission');
const { success, error } = require('../utils/apiResponse');
const { clearPermissionCache } = require('../utils/permissions');

/**
 * GET /api/roles
 */
const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll({ order: [['name', 'ASC']] });
    return success(res, roles);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/roles/:id
 */
const getRoleById = async (req, res, next) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return error(res, 'Role not found.', 404);
    return success(res, role);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/roles
 */
const createRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const normalizedName = name.toUpperCase().trim().replace(/\s+/g, '_');

    const existing = await Role.findOne({ where: { name: normalizedName } });
    if (existing) return error(res, `Role "${normalizedName}" already exists.`, 409);

    const role = await Role.create({ name: normalizedName, description: description || null, isSystem: false });
    return success(res, role, 'Role created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT/PATCH /api/roles/:id
 * Allows updating name (non-system only), description, isActive.
 */
const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return error(res, 'Role not found.', 404);

    const { name, description, isActive } = req.body;

    if (name !== undefined) {
      const normalizedName = name.toUpperCase().trim().replace(/\s+/g, '_');

      // Only block if the name is actually changing
      if (normalizedName !== role.name) {
        const existing = await Role.findOne({ where: { name: normalizedName } });
        if (existing && existing.id !== role.id) {
          return error(res, `Role "${normalizedName}" already exists.`, 409);
        }

        const oldName = role.name;

        await role.update({
          name: normalizedName,
          ...(description !== undefined && { description }),
          ...(isActive !== undefined && { isActive }),
        });

        // Cascade rename to users and role_permissions
        await sequelize.query(
          `UPDATE users SET role = :newName WHERE role = :oldName`,
          { replacements: { newName: normalizedName, oldName } }
        );
        await sequelize.query(
          `UPDATE role_permissions SET role = :newName WHERE role = :oldName`,
          { replacements: { newName: normalizedName, oldName } }
        );

        clearPermissionCache();
      } else {
        // Name is the same — just update other fields
        await role.update({
          ...(description !== undefined && { description }),
          ...(isActive !== undefined && { isActive }),
        });
      }
    } else {
      await role.update({
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      });
    }

    const updated = await Role.findByPk(role.id);
    return success(res, updated, 'Role updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/roles/:id
 */
const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return error(res, 'Role not found.', 404);

    if (role.isSystem) return error(res, 'System roles cannot be deleted.', 422);

    const usersWithRole = await User.count({ where: { role: role.name } });
    if (usersWithRole > 0) {
      return error(res, `Cannot delete role "${role.name}" — ${usersWithRole} user(s) are assigned to it.`, 422);
    }

    await RolePermission.destroy({ where: { role: role.name } });
    await role.destroy();
    clearPermissionCache();

    return success(res, null, 'Role deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllRoles, getRoleById, createRole, updateRole, deleteRole };
