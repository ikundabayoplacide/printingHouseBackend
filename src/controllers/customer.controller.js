const { Op } = require('sequelize');
const Customer = require('../database/models/Customer');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');

/**
 * GET /api/customers
 */
const getAllCustomers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search } = req.query;

    const where = { isActive: true };
    if (search) {
      where[Op.or] = ['name', 'email', 'company', 'phone'].map((field) => ({
        [field]: { [Op.iLike]: `%${search}%` },
      }));
    }

    const { count, rows } = await Customer.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/customers/:id
 */
const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return error(res, 'Customer not found.', 404);

    return success(res, customer);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/customers
 */
const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, company, address, city, country, notes } = req.body;

    const existing = await Customer.findOne({ where: { email } });
    if (existing) return error(res, 'A customer with this email already exists.', 409);

    const customer = await Customer.create({ name, email, phone, company, address, city, country, notes });

    return success(res, customer, 'Customer created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/customers/:id
 */
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return error(res, 'Customer not found.', 404);

    const { name, email, phone, company, address, city, country, notes, isActive } = req.body;

    await customer.update({
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(company !== undefined && { company }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(country !== undefined && { country }),
      ...(notes !== undefined && { notes }),
      ...(isActive !== undefined && { isActive }),
    });

    return success(res, customer, 'Customer updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/customers/:id  (soft delete)
 */
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return error(res, 'Customer not found.', 404);

    await customer.update({ isActive: false });

    return success(res, null, 'Customer deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
