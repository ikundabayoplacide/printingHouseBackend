const { body } = require('express-validator');

const ROLES = ['ADMIN', 'SUPERVISOR', 'SALESMANAGER', 'RECEPTIONIST', 'DAF', 'ACCOUNTANT', 'STOREKEEPER', 'PRINTEMPLOYEE'];

const createUserValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(ROLES)
    .withMessage(`Role must be one of: ${ROLES.join(', ')}`),
];

const updateUserValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('role')
    .optional()
    .isIn(ROLES)
    .withMessage(`Role must be one of: ${ROLES.join(', ')}`),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

module.exports = { createUserValidation, updateUserValidation };
