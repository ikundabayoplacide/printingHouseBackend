const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Permission extends Model {}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Format: resource.action e.g. users.view, jobs.create',
      validate: {
        notEmpty: { msg: 'Permission name is required' },
      },
    },
    resource: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'e.g. users, jobs, customers, stock',
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'e.g. view, create, edit, delete, approve, export, print',
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions',
    timestamps: true,
  }
);

module.exports = Permission;
