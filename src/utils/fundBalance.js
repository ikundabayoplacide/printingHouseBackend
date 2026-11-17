const FundConfig = require('../database/models/FundConfig');
const { Op } = require('sequelize');

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
  const Payment = require('../database/models/Payment');
  const Withdrawal = require('../database/models/Withdrawal');
  const Outstand = require('../database/models/Outstand');

  const paymentSum = await Payment.sum('amountPaid', { where: { paymentMethod: 'CASH' } }) || 0;
  const withdrawalSum = await Withdrawal.sum('amount') || 0;
  const expenseSum = await Outstand.sum('totalAmount', { where: { status: { [Op.in]: ['approved', 'paid'] } } }) || 0;

  const config = await FundConfig.findOne({ where: { id: 1 } });
  const initialAmount = config ? parseFloat(config.initialAmount) : 0;

  const totalBalance = parseFloat((initialAmount + paymentSum + withdrawalSum - expenseSum).toFixed(2));

  await FundConfig.upsert({ id: 1, totalBalance });
  return { initialAmount, totalBalance };
};

/**
 * Compute cashier fund balance using CASH payments only.
 * Does NOT persist — used only for display in getBalance.
 */
const computeCashierBalance = async () => {
  const Payment = require('../database/models/Payment');
  const Withdrawal = require('../database/models/Withdrawal');
  const Outstand = require('../database/models/Outstand');

  const cashPaymentSum = await Payment.sum('amountPaid', { where: { paymentMethod: 'CASH' } }) || 0;
  const withdrawalSum = await Withdrawal.sum('amount') || 0;
  const expenseSum = await Outstand.sum('totalAmount', { where: { status: { [Op.in]: ['approved', 'paid'] } } }) || 0;

  const config = await FundConfig.findOne({ where: { id: 1 } });
  const initialAmount = config ? parseFloat(config.initialAmount) : 0;

  return parseFloat((initialAmount + cashPaymentSum + withdrawalSum - expenseSum).toFixed(2));
};

module.exports = { adjustBalance, recalculateBalance, computeCashierBalance };
