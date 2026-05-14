const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { createUserValidation, updateUserValidation } = require('../modules/users/user.validation');
const { validate } = require('../middlewares/validate.middleware');
// const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// router.use(authenticate);

router.get('/', getAllUsers);
router.post('/',createUserValidation, validate, createUser);
router.get('/:id', authorize('ADMIN'), getUserById);
router.put('/:id', authorize('ADMIN'), updateUserValidation, validate, updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);

module.exports = router;
