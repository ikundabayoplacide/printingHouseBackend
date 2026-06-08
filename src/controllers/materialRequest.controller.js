const Employee = require('../database/models/Employee');
const Job = require('../database/models/Job');
const User = require('../database/models/User');
const MaterialRequest = require('../database/models/MaterialRequest');
const MaterialRequestItem = require('../database/models/MaterialRequestItem');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');

const requestIncludes = [
  { model: MaterialRequestItem, as: 'items' },
  { model: Job, as: 'job', attributes: ['id', 'jobNumber', 'title'] },
  { model: Employee, as: 'employee', attributes: ['id', 'fullName', 'phoneNumber'] },
  { model: User, as: 'responder', attributes: ['id', 'name', 'email'], required: false },
];

/**
 * GET /api/material-requests/my
 * Worker gets their own requests.
 */
const getMyRequests = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) return error(res, 'No employee profile linked to your account.', 404);

    const { page, limit, skip } = getPagination(req.query);
    const where = { employeeId: employee.id };
    if (req.query.status) where.status = req.query.status;

    const { count, rows } = await MaterialRequest.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: requestIncludes,
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/material-requests
 * Stock manager / admin gets all requests.
 */
const getAllRequests = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const where = {};
    if (req.query.status) where.status = req.query.status;

    const { count, rows } = await MaterialRequest.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: requestIncludes,
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/material-requests
 * Worker submits a new request.
 */
const createRequest = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) return error(res, 'No employee profile linked to your account.', 404);

    const { jobId, notes, items } = req.body;

    if (!jobId) return error(res, 'jobId is required.', 422);
    if (!items || items.length === 0) return error(res, 'At least one item is required.', 422);

    for (const item of items) {
      if (!item.name || !item.quantity || !item.unit) {
        return error(res, 'Each item must have name, quantity, and unit.', 422);
      }
    }

    const job = await Job.findByPk(jobId);
    if (!job) return error(res, 'Job not found.', 404);

    const requestNumber = await MaterialRequest.generateRequestNumber();

    const request = await MaterialRequest.create({
      requestNumber,
      jobId,
      employeeId: employee.id,
      notes: notes || null,
    });

    await Promise.all(
      items.map((item) =>
        MaterialRequestItem.create({
          materialRequestId: request.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
        })
      )
    );

    const created = await MaterialRequest.findByPk(request.id, { include: requestIncludes });
    return success(res, created, 'Material request submitted successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/material-requests/:id/approve
 */
const approveRequest = async (req, res, next) => {
  try {
    const request = await MaterialRequest.findByPk(req.params.id);
    if (!request) return error(res, 'Material request not found.', 404);
    if (request.status !== 'pending') return error(res, `Request is already '${request.status}'.`, 409);

    await request.update({
      status: 'approved',
      responseNotes: req.body.responseNotes || null,
      respondedBy: req.user.id,
      respondedAt: new Date(),
    });

    const updated = await MaterialRequest.findByPk(request.id, { include: requestIncludes });
    return success(res, updated, 'Material request approved.');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/material-requests/:id/reject
 */
const rejectRequest = async (req, res, next) => {
  try {
    const request = await MaterialRequest.findByPk(req.params.id);
    if (!request) return error(res, 'Material request not found.', 404);
    if (request.status !== 'pending') return error(res, `Request is already '${request.status}'.`, 409);

    await request.update({
      status: 'rejected',
      responseNotes: req.body.responseNotes || null,
      respondedBy: req.user.id,
      respondedAt: new Date(),
    });

    const updated = await MaterialRequest.findByPk(request.id, { include: requestIncludes });
    return success(res, updated, 'Material request rejected.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyRequests, getAllRequests, createRequest, approveRequest, rejectRequest };
