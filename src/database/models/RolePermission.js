const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class RolePermission extends Model {}

RolePermission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'role_permissions',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['role', 'permissionId'] },
    ],
  }
);

module.exports = RolePermission;
