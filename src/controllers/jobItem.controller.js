const JobItem = require('../database/models/JobItem');
const Job = require('../database/models/Job');
const StockItem = require('../database/models/StockItem');
const { success, error } = require('../utils/apiResponse');

const jobItemIncludes = [
  { model: StockItem, as: 'stockItem', attributes: ['id', 'itemName', 'category', 'unit', 'currentStock'] },
];

/**
 * GET /api/jobs/:jobId/items
 * Get all items for a job.
 */
const getJobItems = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return error(res, 'Job not found.', 404);

    const items = await JobItem.findAll({
      where: { jobId: req.params.jobId },
      include: jobItemIncludes,
      order: [['createdAt', 'ASC']],
    });

    return success(res, items);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/jobs/:jobId/items
 * Add a stock item to a job.
 */
const addJobItem = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return error(res, 'Job not found.', 404);

    const { stockItemId, quantityNeeded, notes } = req.body;

    const stockItem = await StockItem.findByPk(stockItemId);
    if (!stockItem) return error(res, 'Stock item not found.', 404);
    if (!stockItem.isActive) return error(res, `Stock item "${stockItem.itemName}" is inactive.`, 422);

    // Check if already added
    const existing = await JobItem.findOne({ where: { jobId: req.params.jobId, stockItemId } });
    if (existing) return error(res, 'This stock item is already added to the job. Update it instead.', 409);

    // Warn if quantity needed exceeds current stock
    if (parseFloat(quantityNeeded) > parseFloat(stockItem.currentStock)) {
      return error(res, `Insufficient stock for "${stockItem.itemName}". Available: ${stockItem.currentStock} ${stockItem.unit || ''}, requested: ${quantityNeeded}.`, 422);
    }

    const jobItem = await JobItem.create({
      jobId: req.params.jobId,
      stockItemId,
      quantityNeeded,
      notes: notes || null,
    });

    const created = await JobItem.findByPk(jobItem.id, { include: jobItemIncludes });
    return success(res, created, 'Item added to job successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/jobs/:jobId/items/:id
 * Update a job item (quantityNeeded, quantityUsed, notes).
 */
const updateJobItem = async (req, res, next) => {
  try {
    const jobItem = await JobItem.findOne({
      where: { id: req.params.id, jobId: req.params.jobId },
    });
    if (!jobItem) return error(res, 'Job item not found.', 404);

    const { quantityNeeded, quantityUsed, notes } = req.body;

    await jobItem.update({
      ...(quantityNeeded !== undefined && { quantityNeeded }),
      ...(quantityUsed !== undefined && { quantityUsed }),
      ...(notes !== undefined && { notes }),
    });

    const updated = await JobItem.findByPk(jobItem.id, { include: jobItemIncludes });
    return success(res, updated, 'Job item updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/jobs/:jobId/items/:id
 * Remove a stock item from a job.
 */
const removeJobItem = async (req, res, next) => {
  try {
    const jobItem = await JobItem.findOne({
      where: { id: req.params.id, jobId: req.params.jobId },
    });
    if (!jobItem) return error(res, 'Job item not found.', 404);

    await jobItem.destroy();
    return success(res, null, 'Item removed from job successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getJobItems, addJobItem, updateJobItem, removeJobItem };
