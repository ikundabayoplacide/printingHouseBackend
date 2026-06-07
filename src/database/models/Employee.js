const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Employee extends Model {}

Employee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Full name is required' } },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Phone number is required' } },
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nid: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: 'National ID number (optional)',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { isEmail: { msg: 'Must be a valid email address' } },
      set(value) {
        this.setDataValue('email', value ? value.toLowerCase().trim() : null);
      },
    },
    supportContact: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Emergency / support contact phone number',
    },
    bankAccount: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Bank account number for salary payment',
    },
    contractSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: { min: { args: [0], msg: 'Salary must be 0 or greater' } },
    },
    contractType: {
      type: DataTypes.ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'),
      allowNull: false,
      defaultValue: 'FULL_TIME',
    },
    hiredAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date the employee was hired',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Currently assigned job for this employee',
    },
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
  }
);

module.exports = Employee;
