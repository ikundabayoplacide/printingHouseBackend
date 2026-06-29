const express = require('express');
const router = express.Router();
const {
  assignMachine,
  unassignMachine,
  reassignMachine,
  getAssignmentsByMachine,
  getAssignmentsByEmployee,
} = require('../controllers/machineAssignment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router.post('/', authorize('ADMIN', 'SUPERVISOR'), assignMachine);
router.delete('/:id', authorize('ADMIN', 'SUPERVISOR'), unassignMachine);
router.put('/:id/reassign', authorize('ADMIN', 'SUPERVISOR'), reassignMachine);
router.get('/machine/:machineId', getAssignmentsByMachine);
router.get('/employee/:employeeId', getAssignmentsByEmployee);

module.exports = router;
