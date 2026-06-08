const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class SubTask extends Model {}

SubTask.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Subtask title is required' } },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'SubTask',
    tableName: 'subtasks',
    timestamps: true,
  }
);

module.exports = SubTask;
