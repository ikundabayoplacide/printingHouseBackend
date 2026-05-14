const { Op } = require('sequelize');
const Job = require('../database/models/Job');
const Customer = require('../database/models/Customer');
const User = require('../database/models/User');
const Department = require('../database/models/Department');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');
const notify = require('../utils/notification.service');

// Common includes for job queries
const jobIncludes = [
  { model: Customer, as: 'customer', attributes: ['id', 'name', 'email', 'phone', 'company'] },
  { model: User, as: 'createdBy', attributes: ['id', 'name', 'email', 'role'] },
  { model: Department, as: 'departmentAssignedTo', attributes: ['id', 'name'] },
];

/**
 * GET /api/jobs/number/:jobNumber
 */
const getJobByNumber = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { jobNumber: req.params.jobNumber.toUpperCase() },
      include: jobIncludes,
    });
    if (!job) return error(res, `Job '${req.params.jobNumber}' not found.`, 404);
    return success(res, job);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/jobs/next-number
 */
const getNextJobNumber = async (req, res, next) => {
  try {
    const jobNumber = await Job.generateJobNumber();
    return success(res, { jobNumber });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/jobs
 */
const getAllJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { status, priority, customerId, departmentAssignedToId, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (customerId) where.customerId = customerId;
    if (departmentAssignedToId) where.departmentAssignedToId = departmentAssignedToId;

    if (search) {
      where[Op.or] = [
        { jobNumber: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Job.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: jobIncludes,
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/jobs/:id
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, { include: jobIncludes });
    if (!job) return error(res, 'Job not found.', 404);
    return success(res, job);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/jobs
 * Notify all SUPERVISOR users when a new job is created.
 */
const createJob = async (req, res, next) => {
  try {
    const {
      title, description, jobType, quantity, size,
      colorMode, bindingType, priority, dueDate, notes,
      customerId,
    } = req.body;

    const customer = await Customer.findOne({ where: { id: customerId, isActive: true } });
    if (!customer) return error(res, 'Customer not found or inactive.', 404);

    const jobNumber = await Job.generateJobNumber();

    const job = await Job.create({
      jobNumber, title, description, jobType, quantity, size,
      colorMode, bindingType, priority: priority || 'normal',
      dueDate, notes, customerId,
      createdById: req.user.id,
    });

    // Notify all SUPERVISOR users (production managers)
    const supervisors = await User.findAll({
      where: { role: 'SUPERVISOR', isActive: true },
      attributes: ['id'],
    });

    await Promise.all(
      supervisors.map((sv) =>
        notify(
          sv.id,
          'New Job Created',
          `A new job "${title}" (${jobNumber}) has been registered for customer "${customer.name}".`,
          'JOB_CREATED',
          'job',
          job.id
        )
      )
    );

    const created = await Job.findByPk(job.id, { include: jobIncludes });
    return success(res, created, 'Job registered successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/jobs/:id
 */
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return error(res, 'Job not found.', 404);

    const {
      title, description, jobType, quantity, size,
      colorMode, bindingType, priority, dueDate, notes,
      departmentAssignedToId,
    } = req.body;

    if (departmentAssignedToId) {
      const dept = await Department.findOne({ where: { id: departmentAssignedToId, isActive: true } });
      if (!dept) return error(res, 'Department not found or inactive.', 404);
    }

    await job.update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(jobType !== undefined && { jobType }),
      ...(quantity !== undefined && { quantity }),
      ...(size !== undefined && { size }),
      ...(colorMode !== undefined && { colorMode }),
      ...(bindingType !== undefined && { bindingType }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate }),
      ...(notes !== undefined && { notes }),
      ...(departmentAssignedToId !== undefined && { departmentAssignedToId }),
    });

    const updated = await Job.findByPk(job.id, { include: jobIncludes });
    return success(res, updated, 'Job updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/jobs/:id/status
 * Notify all SUPERVISOR users when job status changes.
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return error(res, 'Job not found.', 404);

    const { status } = req.body;

    if (!Job.canTransition(job.status, status)) {
      return error(res, `Invalid status transition from '${job.status}' to '${status}'.`, 422);
    }

    const previousStatus = job.status;
    await job.update({ status });

    // Notify all SUPERVISOR users of the status change
    const supervisors = await User.findAll({
      where: { role: 'SUPERVISOR', isActive: true },
      attributes: ['id'],
    });

    await Promise.all(
      supervisors.map((sv) =>
        notify(
          sv.id,
          'Job Status Changed',
          `Job ${job.jobNumber} status changed from "${previousStatus}" to "${status}".`,
          'JOB_STATUS_CHANGED',
          'job',
          job.id
        )
      )
    );

    return success(res, { id: job.id, jobNumber: job.jobNumber, status: job.status }, 'Job status updated.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/jobs/:id/assign
 * Assign job to a department and notify all users in that department.
 * Also notify SUPERVISOR users that the assignment was made.
 */
const assignJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return error(res, 'Job not found.', 404);

    const { departmentAssignedToId } = req.body;

    const dept = await Department.findOne({ where: { id: departmentAssignedToId, isActive: true } });
    if (!dept) return error(res, 'Department not found or inactive.', 404);

    await job.update({ departmentAssignedToId });

    // Notify all SUPERVISOR users that they assigned the job
    const supervisors = await User.findAll({
      where: { role: 'SUPERVISOR', isActive: true },
      attributes: ['id'],
    });

    await Promise.all(
      supervisors.map((sv) =>
        notify(
          sv.id,
          'Job Assigned to Department',
          `Job ${job.jobNumber} has been assigned to the "${dept.name}" department.`,
          'JOB_ASSIGNED',
          'job',
          job.id
        )
      )
    );

    // Notify all PRINTEMPLOYEE users (workers in the department get notified)
    // In future this can be filtered by department membership; for now notify all active print employees
    const printEmployees = await User.findAll({
      where: { role: 'PRINTEMPLOYEE', isActive: true },
      attributes: ['id'],
    });

    await Promise.all(
      printEmployees.map((pe) =>
        notify(
          pe.id,
          'New Job Assigned to Your Department',
          `Job ${job.jobNumber} has been assigned to the "${dept.name}" department.`,
          'DEPARTMENT_ASSIGNED',
          'job',
          job.id
        )
      )
    );

    return success(
      res,
      { id: job.id, jobNumber: job.jobNumber, departmentAssignedTo: { id: dept.id, name: dept.name } },
      'Job assigned to department successfully.'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/jobs/:id
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return error(res, 'Job not found.', 404);

    if (!['pending', 'confirmed'].includes(job.status)) {
      return error(res, 'Only pending or confirmed jobs can be deleted.', 422);
    }

    await job.destroy();
    return success(res, null, 'Job deleted successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/departments/:id/jobs
 */
const getJobsByDepartment = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { status, priority, search } = req.query;

    const department = await Department.findByPk(req.params.id);
    if (!department) return error(res, 'Department not found.', 404);

    const where = { departmentAssignedToId: req.params.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where[Op.or] = [
        { jobNumber: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Job.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'name', 'email', 'phone', 'company'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email', 'role'] },
      ],
    });

    return paginated(res, rows, count, page, limit, `Jobs for department: ${department.name}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNextJobNumber,
  getJobByNumber,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  assignJob,
  deleteJob,
  getJobsByDepartment,
};
