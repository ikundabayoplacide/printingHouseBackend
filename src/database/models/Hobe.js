const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Hobe extends Model {}

Hobe.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hobeNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'hobe_no',
      comment: 'Unique hobe/batch number',
    },
    nameOfHobe: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name_of_hobe',
    },
    doneAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'done_at',
      comment: 'Production completion date',
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expired_at',
      comment: 'Expiry date of the batch',
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: { args: [1], msg: 'Quantity must be at least 1' } },
      comment: 'Total quantity produced',
    },
    pricePerItem: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'price_per_item',
      validate: { min: { args: [0], msg: 'Price per item cannot be negative' } },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'total_price',
      comment: 'qty × pricePerItem',
    },
    qtySold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'qty_sold',
    },
    qtyRemains: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'qty_remains',
      comment: 'qty - qtySold',
    },
    ob: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Opening balance / carry-forward amount',
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'expired'),
      allowNull: false,
      defaultValue: 'active',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by_id',
    },
  },
  {
    sequelize,
    modelName: 'Hobe',
    tableName: 'hobes',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Hobe;
