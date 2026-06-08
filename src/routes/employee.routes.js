const express = require('express');
const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  toggleEmployeeActive,
  assignDepartment,
  assignJob,
  unassignJob,
  deleteEmployee,
} = require('../controllers/employee.controller');

const { createEmployeeValidation, updateEmployeeValidation, assignJobValidation } = require('../modules/employees/employee.validation');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorize('ADMIN', 'HR'), createEmployeeValidation, validate, createEmployee);
router.put('/:id', authorize('ADMIN', 'HR'), updateEmployeeValidation, validate, updateEmployee);
router.patch('/:id/department', authorize('ADMIN', 'HR'), assignDepartment);
router.patch('/:id/assign-job', authorize('ADMIN', 'HR', 'SUPERVISOR'), assignJobValidation, validate, assignJob);
router.patch('/:id/unassign-job', authorize('ADMIN', 'HR', 'SUPERVISOR'), assignJobValidation, validate, unassignJob);
router.patch('/:id/toggle-active', authorize('ADMIN', 'HR'), toggleEmployeeActive);
router.delete('/:id', authorize('ADMIN'), deleteEmployee);

module.exports = router;
