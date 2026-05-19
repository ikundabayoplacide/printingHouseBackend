const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title is required' },
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Message is required' },
      },
    },
    type: {
      type: DataTypes.ENUM(
        'JOB_CREATED',
        'JOB_ASSIGNED',
        'JOB_STATUS_CHANGED',
        'DEPARTMENT_ASSIGNED',
        'PAYMENT_RECEIVED',
        'GENERAL'
      ),
      defaultValue: 'GENERAL',
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    relatedEntityType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relatedEntityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
  }
);

module.exports = Notification;
