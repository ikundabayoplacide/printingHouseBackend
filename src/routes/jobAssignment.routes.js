const express = require('express');
const router = express.Router();

const {
  assignJobToEmployee,
  unassignJobFromEmployee,
  getEmployeesByDepartment,
  getEmployeesAssignedToJob,
} = require('../controllers/jobAssignment.controller');

const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

// Assign a job to an employee
router.post('/assign', authorize('ADMIN', 'SUPERVISOR'), assignJobToEmployee);

// Remove job assignment from an employee
router.delete('/unassign/:employeeId', authorize('ADMIN', 'SUPERVISOR'), unassignJobFromEmployee);

// Get all employees in a department with their current job
router.get('/employees/:departmentId', authorize('ADMIN', 'SUPERVISOR'), getEmployeesByDepartment);

// Get all employees assigned to a specific job
router.get('/job/:jobId/employees', authorize('ADMIN', 'SUPERVISOR'), getEmployeesAssignedToJob);

module.exports = router;
