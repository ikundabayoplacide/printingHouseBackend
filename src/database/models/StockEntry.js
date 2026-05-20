const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class StockEntry extends Model {}

StockEntry.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    stockItemId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receivedById: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who received/recorded the stock entry',
    },
    quantityIn: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: { args: [0.01], msg: 'Quantity must be greater than 0' },
      },
    },
    unitCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Cost per unit for this entry',
    },
    totalCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: 'quantityIn * unitCost',
    },
    supplier: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    referenceNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Invoice or delivery note number',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    entryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    stockBefore: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stockAfter: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'StockEntry',
    tableName: 'stock_entries',
    timestamps: true,
  }
);

module.exports = StockEntry;
