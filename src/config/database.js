const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const logger = require('../utils/logger');

const dbUrl = process.env.DATABASE_URL || '';
const dialect = dbUrl.startsWith('mysql') ? 'mysql' : 'postgres';

const sequelize = new Sequelize(dbUrl, {
  dialect,
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  ...(dialect === 'postgres' && { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }),
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`${dialect === 'mysql' ? 'MySQL' : 'PostgreSQL'} connected successfully.`);
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
