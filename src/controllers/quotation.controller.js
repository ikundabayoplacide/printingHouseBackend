const { Op } = require('sequelize');
const Quotation = require('../database/models/Quotation');
const Job = require('../database/models/Job');
const Customer = require('../database/models/Customer');
const User = require('../database/models/User');
const JobItem = require('../database/models/JobItem');
const StockItem = require('../database/models/StockItem');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');

const quotationIncludes = [
  { model: Job, as: 'job', attributes: ['id', 'jobNumber', 'title', 'status', 'jobType', 'quantity', 'size', 'colorMode', 'bindingType', 'dueDate'],
    include: [
      { model: JobItem, as: 'jobItems', include: [{ model: StockItem, as: 'stockItem', attributes: ['id', 'itemName', 'unit', 'unitCost'] }] },
    ],
  },
  { model: Customer, as: 'customer', attributes: ['id', 'name', 'email', 'phone', 'company'] },
  { model: User, as: 'createdBy', attributes: ['id', 'name', 'email', 'role'] },
];

/**
 * GET /api/quotations
 */
const getAllQuotations = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { status, customerId, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (search) {
      where[Op.or] = [
        { quotationNo: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Quotation.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: quotationIncludes,
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/quotations/:id
 */
const getQuotationById = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, { include: quotationIncludes });
    if (!quotation) return error(res, 'Quotation not found.', 404);
    return success(res, quotation);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/quotations/job/:jobId
 */
const getQuotationsByJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return error(res, 'Job not found.', 404);

    const quotations = await Quotation.findAll({
      where: { jobId: req.params.jobId },
      order: [['createdAt', 'DESC']],
      include: quotationIncludes,
    });

    return success(res, quotations);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/quotations
 * Create a quotation manually or auto-called from job creation.
 */
const createQuotation = async (req, res, next) => {
  try {
    const { jobId, subtotal, validUntil, notes, terms } = req.body;

    const job = await Job.findByPk(jobId, {
      include: [{ model: Customer, as: 'customer' }],
    });
    if (!job) return error(res, 'Job not found.', 404);

    const sub = parseFloat(subtotal || job.amount || 0);

    const quotationNo = await Quotation.generateQuotationNo();

    const quotation = await Quotation.create({
      quotationNo,
      jobId,
      customerId: job.customerId,
      createdById: req.user.id,
      subtotal: sub,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      totalAmount: sub,
      status: 'draft',
      validUntil: validUntil || null,
      notes: notes || null,
      terms: terms || null,
    });

    const created = await Quotation.findByPk(quotation.id, { include: quotationIncludes });
    return success(res, created, 'Quotation created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/quotations/:id
 * Update quotation details (only if draft).
 */
const updateQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id);
    if (!quotation) return error(res, 'Quotation not found.', 404);

    if (quotation.status !== 'draft') {
      return error(res, `Cannot edit a quotation with status "${quotation.status}". Only draft quotations can be edited.`, 422);
    }

    const { subtotal, taxRate, discount, validUntil, notes, terms } = req.body;

    const sub = parseFloat(subtotal !== undefined ? subtotal : quotation.subtotal);
    const tax = parseFloat(taxRate !== undefined ? taxRate : quotation.taxRate);
    const disc = parseFloat(discount !== undefined ? discount : quotation.discount);
    const taxAmount = parseFloat(((sub * tax) / 100).toFixed(2));
    const totalAmount = parseFloat((sub + taxAmount - disc).toFixed(2));

    await quotation.update({
      subtotal: sub,
      taxRate: tax,
      taxAmount,
      discount: disc,
      totalAmount,
      ...(validUntil !== undefined && { validUntil }),
      ...(notes !== undefined && { notes }),
      ...(terms !== undefined && { terms }),
    });

    const updated = await Quotation.findByPk(quotation.id, { include: quotationIncludes });
    return success(res, updated, 'Quotation updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/quotations/:id/status
 * Update quotation status.
 */
const updateQuotationStatus = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id);
    if (!quotation) return error(res, 'Quotation not found.', 404);

    const { status } = req.body;
    const validStatuses = ['draft', 'sent', 'accepted', 'rejected', 'expired'];
    if (!validStatuses.includes(status)) {
      return error(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}.`, 400);
    }

    await quotation.update({ status });
    return success(res, { id: quotation.id, quotationNo: quotation.quotationNo, status }, 'Quotation status updated.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/quotations/:id
 * Delete a quotation (only draft).
 */
const deleteQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id);
    if (!quotation) return error(res, 'Quotation not found.', 404);

    if (quotation.status !== 'draft') {
      return error(res, 'Only draft quotations can be deleted.', 422);
    }

    await quotation.destroy();
    return success(res, null, 'Quotation deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllQuotations,
  getQuotationById,
  getQuotationsByJob,
  createQuotation,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
};
