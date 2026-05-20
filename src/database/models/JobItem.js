const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class JobItem extends Model {}

JobItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    stockItemId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantityNeeded: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: { args: [0.01], msg: 'Quantity needed must be greater than 0' },
      },
      comment: 'Quantity planned/requested for this job',
    },
    quantityUsed: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
      comment: 'Actual quantity used (filled when job is in production)',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'JobItem',
    tableName: 'job_items',
    timestamps: true,
  }
);

module.exports = JobItem;
