const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class EmployeeJobAssignment extends Model {}

EmployeeJobAssignment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assignedById: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'The supervisor/admin who made this assignment',
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'EmployeeJobAssignment',
    tableName: 'employee_job_assignments',
    timestamps: true,
  }
);

module.exports = EmployeeJobAssignment;
