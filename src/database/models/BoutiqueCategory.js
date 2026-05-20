const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class BoutiqueCategory extends Model {}

BoutiqueCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Category name is required' },
      },
    },
    skuPrefix: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      comment: 'e.g. PRN, BND, PKG, STA, SGN, PRO',
    },
    colorClass: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Tailwind class or hex color for UI display',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BoutiqueCategory',
    tableName: 'boutique_categories',
    timestamps: true,
  }
);

module.exports = BoutiqueCategory;
