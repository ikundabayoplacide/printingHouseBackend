const express = require('express');
const router = express.Router();

const {
  getAllPermissions, createPermission, updatePermission, deletePermission,
  getRolePermissions, getMyPermissions,
  grantPermission, revokePermission, setRolePermissions,
} = require('../controllers/permission.controller');

const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

// Permission CRUD
router.get('/', getAllPermissions);
router.post('/', authorize('ADMIN'), createPermission);
router.put('/:id', authorize('ADMIN'), updatePermission);
router.delete('/:id', authorize('ADMIN'), deletePermission);

// Current user permissions
router.get('/my', getMyPermissions);

// Role permission management
router.get('/role/:role', getRolePermissions);
router.post('/role/:role', authorize('ADMIN'), grantPermission);
router.put('/role/:role', authorize('ADMIN'), setRolePermissions);
router.delete('/role/:role/:permissionId', authorize('ADMIN'), revokePermission);

module.exports = router;
