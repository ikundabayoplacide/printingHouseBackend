const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class CustomerVisit extends Model {}

CustomerVisit.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    recordedById: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User (receptionist) who recorded the visit',
    },
    type: {
      type: DataTypes.ENUM('IN', 'OUT'),
      allowNull: false,
      comment: 'IN = checked in, OUT = checked out',
    },
    checkinAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    checkoutAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Filled when customer checks out',
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Reason for visit e.g. job pickup, inquiry, payment',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'CustomerVisit',
    tableName: 'customer_visits',
    timestamps: true,
  }
);

module.exports = CustomerVisit;
