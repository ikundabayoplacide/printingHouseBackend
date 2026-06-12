const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class HobeSale extends Model {}

HobeSale.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hobeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'hobe_id',
    },
    soldById: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'sold_by_id',
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'customer_id',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: { args: [1], msg: 'Quantity must be at least 1' } },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'unit_price',
      comment: 'Price per item at time of sale',
    },
    totalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'total_price',
      comment: 'quantity × unitPrice',
    },
    amountPaid: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'amount_paid',
    },
    balanceDue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'balance_due',
    },
    changeGiven: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'change_given',
    },
    paymentStatus: {
      type: DataTypes.ENUM('paid', 'partial', 'overpaid'),
      allowNull: false,
      defaultValue: 'paid',
      field: 'payment_status',
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'mobile', 'card', 'bank'),
      allowNull: false,
      defaultValue: 'cash',
      field: 'payment_method',
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'HobeSale',
    tableName: 'hobe_sales',
    timestamps: true,
    underscored: true,
  }
);

module.exports = HobeSale;
