const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class RecoveryRecord extends Model {}

RecoveryRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'job_id',
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'customer_id',
    },
    recordedById: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'recorded_by_id',
    },
    amountRecovered: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'amount_recovered',
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'balance_after',
    },
    paymentMethod: {
      type: DataTypes.ENUM('CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CARD'),
      allowNull: true,
      field: 'payment_method',
    },
    status: {
      type: DataTypes.ENUM('pending', 'recovered', 'partial', 'written_off'),
      allowNull: false,
      defaultValue: 'pending',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'contacted_at',
    },
  },
  {
    sequelize,
    modelName: 'RecoveryRecord',
    tableName: 'recovery_records',
    timestamps: true,
    underscored: true,
  }
);

module.exports = RecoveryRecord;
