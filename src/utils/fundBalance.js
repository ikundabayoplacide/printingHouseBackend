const FundConfig = require('../database/models/FundConfig');

/**
 * Adjust the stored totalBalance in fund_config.
 * @param {'add'|'deduct'} operation
 * @param {number} amount
 */
const adjustBalance = async (operation, amount) => {
  const config = await FundConfig.findOne({ where: { id: 1 } });
  if (!config) return;

  const current = parseFloat(config.totalBalance);
  const value = parseFloat(amount);
  const newBalance = operation === 'add'
    ? parseFloat((current + value).toFixed(2))
    : parseFloat((current - value).toFixed(2));

  await config.update({ totalBalance: newBalance });
  return newBalance;
};

/**
 * Recalculate totalBalance from scratch and persist it.
 * Used when initialAmount is changed.
 */
const recalculateBalance = async () => {
  const { sequelize } = require('../config/database');

  const [[paymentSum]] = await sequelize.query(
    `SELECT COALESCE(SUM(amountPaid), 0) AS total FROM payments WHERE paymentMethod = 'CASH'`
  );
  const [[withdrawalSum]] = await sequelize.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM withdrawals`
  );
  const [[expenseSum]] = await sequelize.query(
    `SELECT COALESCE(SUM(totalAmount), 0) AS total FROM outstands WHERE status IN ('approved', 'paid')`
  );

  const config = await FundConfig.findOne({ where: { id: 1 } });
  const initialAmount = config ? parseFloat(config.initialAmount) : 0;

  const totalBalance = parseFloat((
    initialAmount +
    parseFloat(paymentSum.total) +
    parseFloat(withdrawalSum.total) -
    parseFloat(expenseSum.total)
  ).toFixed(2));

  await FundConfig.upsert({ id: 1, totalBalance });
  return { initialAmount, totalBalance };
};

/**
 * Compute cashier fund balance using CASH payments only.
 * Does NOT persist — used only for display in getBalance.
 */
const computeCashierBalance = async () => {
  const { sequelize } = require('../config/database');

  const [[cashPaymentSum]] = await sequelize.query(
    `SELECT COALESCE(SUM(amountPaid), 0) AS total FROM payments WHERE paymentMethod = 'CASH'`
  );
  const [[withdrawalSum]] = await sequelize.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM withdrawals`
  );
  const [[expenseSum]] = await sequelize.query(
    `SELECT COALESCE(SUM(totalAmount), 0) AS total FROM outstands WHERE status IN ('approved', 'paid')`
  );

  const config = await FundConfig.findOne({ where: { id: 1 } });
  const initialAmount = config ? parseFloat(config.initialAmount) : 0;

  return parseFloat((
    initialAmount +
    parseFloat(cashPaymentSum.total) +
    parseFloat(withdrawalSum.total) -
    parseFloat(expenseSum.total)
  ).toFixed(2));
};

module.exports = { adjustBalance, recalculateBalance, computeCashierBalance };
