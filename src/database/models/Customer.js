const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

class Customer extends Model {}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Customer name is required' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
      set(value) {
        if (value) this.setDataValue('email', value.toLowerCase().trim());
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Phone number is required' },
        len: { args: [7, 20], msg: 'Phone number must be between 7 and 20 characters' },
      },
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tin: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Tax Identification Number for company customers',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('BUSINESS', 'VISITOR', 'BOUTIQUE', 'HOBE'),
      defaultValue: 'VISITOR',
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
  }
);

module.exports = Customer;
