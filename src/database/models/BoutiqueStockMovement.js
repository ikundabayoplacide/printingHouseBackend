const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class BoutiqueStockMovement extends Model {}

BoutiqueStockMovement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    changedById: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    change: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Positive = restock, negative = sale/use',
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'e.g. restock, sale, adjustment',
    },
    stockBefore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Stock level before this change',
    },
    stockAfter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Stock level after this change',
    },
  },
  {
    sequelize,
    modelName: 'BoutiqueStockMovement',
    tableName: 'boutique_stock_movements',
    timestamps: true,
  }
);

module.exports = BoutiqueStockMovement;
