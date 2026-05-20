const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class StockSortie extends Model {}

StockSortie.init(
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
    requesterId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who requested the stock out',
    },
    approvedById: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who approved the sortie (STOCK manager or ADMIN)',
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'FK to jobs — which job this stock was used for',
    },
    dossierNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Job number or reference e.g. JOB-2026-001',
    },
    quantityOut: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: { args: [0.01], msg: 'Quantity must be greater than 0' },
      },
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'e.g. job production, maintenance, adjustment',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false,
    },
    sortieDate: {
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
    modelName: 'StockSortie',
    tableName: 'stock_sorties',
    timestamps: true,
  }
);

module.exports = StockSortie;
