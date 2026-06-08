const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class MaterialRequestItem extends Model {}

MaterialRequestItem.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    materialRequestId: { type: DataTypes.UUID, allowNull: false, field: 'material_request_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'MaterialRequestItem', tableName: 'material_request_items', timestamps: true, underscored: true }
);

module.exports = MaterialRequestItem;
