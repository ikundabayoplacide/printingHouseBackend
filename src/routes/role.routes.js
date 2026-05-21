const express = require('express');
const router = express.Router();

const { getAllRoles, getRoleById, createRole, updateRole, deleteRole } = require('../controllers/role.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router.get('/', getAllRoles);
router.get('/:id', getRoleById);
router.post('/', authorize('ADMIN'), createRole);
router.put('/:id', authorize('ADMIN'), updateRole);
router.patch('/:id', authorize('ADMIN'), updateRole);
router.delete('/:id', authorize('ADMIN'), deleteRole);

module.exports = router;
