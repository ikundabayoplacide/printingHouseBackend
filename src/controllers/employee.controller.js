const { Op } = require('sequelize');
const Employee = require('../database/models/Employee');
const Department = require('../database/models/Department');
const Job = require('../database/models/Job');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');

const employeeIncludes = [
  { model: Department, as: 'department', attributes: ['id', 'name'] },
  { model: Job, as: 'job', attributes: ['id', 'jobNumber', 'title', 'state', 'status', 'priority'], required: false },
];

/**
 * GET /api/employees
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { departmentId, isActive, search } = req.query;

    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Employee.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: employeeIncludes,
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/employees/:id
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id, { include: employeeIncludes });
    if (!employee) return error(res, 'Employee not found.', 404);
    return success(res, employee);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/employees
 */
const createEmployee = async (req, res, next) => {
  try {
    const {
      fullName, phoneNumber, gender, dateOfBirth,
      nid, address, email, supportContact, bankAccount,
      contractSalary, contractType, hiredAt, departmentId,
    } = req.body;

    if (departmentId) {
      const dept = await Department.findByPk(departmentId);
      if (!dept) return error(res, 'Department not found.', 404);
    }

    const employee = await Employee.create({
      fullName, phoneNumber, gender, dateOfBirth,
      nid: nid || null,
      address,
      email: email || null,
      supportContact: supportContact || null,
      bankAccount: bankAccount || null,
      contractSalary,
      contractType: contractType || 'FULL_TIME',
      hiredAt: hiredAt || null,
      departmentId: departmentId || null,
    });

    const created = await Employee.findByPk(employee.id, { include: employeeIncludes });
    return success(res, created, 'Employee created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/employees/:id
 */
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return error(res, 'Employee not found.', 404);

    const {
      fullName, phoneNumber, gender, dateOfBirth,
      nid, address, email, supportContact, bankAccount,
      contractSalary, contractType, hiredAt, departmentId, isActive,
    } = req.body;

    if (departmentId) {
      const dept = await Department.findByPk(departmentId);
      if (!dept) return error(res, 'Department not found.', 404);
    }

    await employee.update({
      ...(fullName !== undefined && { fullName }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      ...(gender !== undefined && { gender }),
      ...(dateOfBirth !== undefined && { dateOfBirth }),
      ...(nid !== undefined && { nid }),
      ...(address !== undefined && { address }),
      ...(email !== undefined && { email }),
      ...(supportContact !== undefined && { supportContact }),
      ...(bankAccount !== undefined && { bankAccount }),
      ...(contractSalary !== undefined && { contractSalary }),
      ...(contractType !== undefined && { contractType }),
      ...(hiredAt !== undefined && { hiredAt }),
      ...(departmentId !== undefined && { departmentId }),
      ...(isActive !== undefined && { isActive }),
    });

    const updated = await Employee.findByPk(employee.id, { include: employeeIncludes });
    return success(res, updated, 'Employee updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/employees/:id/department
 */
const assignDepartment = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return error(res, 'Employee not found.', 404);

    const { departmentId } = req.body;

    if (departmentId) {
      const dept = await Department.findByPk(departmentId);
      if (!dept) return error(res, 'Department not found.', 404);
    }

    await employee.update({ departmentId: departmentId || null });
    const updated = await Employee.findByPk(employee.id, { include: employeeIncludes });
    return success(res, updated, departmentId ? 'Employee assigned to department.' : 'Employee removed from department.');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/employees/:id/toggle-active
 */
const toggleEmployeeActive = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return error(res, 'Employee not found.', 404);

    await employee.update({ isActive: !employee.isActive });
    return success(res, { id: employee.id, isActive: employee.isActive },
      `Employee ${employee.isActive ? 'activated' : 'deactivated'} successfully.`);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/employees/:id/assign-job
 */
const assignJob = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return error(res, 'Employee not found.', 404);

    const { jobId } = req.body;

    if (jobId) {
      const job = await Job.findByPk(jobId);
      if (!job) return error(res, 'Job not found.', 404);

      // If the job is assigned to a department, the employee must belong to that department
      if (job.departmentAssignedToId && employee.departmentId !== job.departmentAssignedToId) {
        const dept = await Department.findByPk(job.departmentAssignedToId, { attributes: ['name'] });
        return error(
          res,
          `Employee does not belong to the job's assigned department (${dept?.name || job.departmentAssignedToId}).`,
          422
        );
      }
    }

    await employee.update({ jobId: jobId || null });
    const updated = await Employee.findByPk(employee.id, { include: employeeIncludes });
    return success(res, updated, jobId ? 'Job assigned to employee successfully.' : 'Job removed from employee.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/employees/:id
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return error(res, 'Employee not found.', 404);

    await employee.destroy();
    return success(res, null, 'Employee deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  toggleEmployeeActive,
  assignDepartment,
  assignJob,
  deleteEmployee,
};
