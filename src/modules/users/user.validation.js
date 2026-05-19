const { body } = require('express-validator');

const ROLES = ['ADMIN', 'RECEPTIONIST', 'SALES', 'DAF', 'ACCOUNTANT', 'PRODUCTION_MANAGER', 'STOCK', 'SUPERVISOR', 'WORKER'];
const GENDERS = ['MALE', 'FEMALE', 'OTHER'];

const createUserValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isLength({ min: 7, max: 20 }).withMessage('Phone must be between 7 and 20 characters'),
  body('departmentId').optional().isUUID().withMessage('departmentId must be a valid UUID'),
  body('gender').optional().isIn(GENDERS).withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('role').optional().isIn(ROLES).withMessage(`Role must be one of: ${ROLES.join(', ')}`),
];

const updateUserValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().isLength({ min: 7, max: 20 }).withMessage('Phone must be between 7 and 20 characters'),
  body('departmentId').optional().isUUID().withMessage('departmentId must be a valid UUID'),
  body('gender').optional().isIn(GENDERS).withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('role').optional().isIn(ROLES).withMessage(`Role must be one of: ${ROLES.join(', ')}`),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

module.exports = { createUserValidation, updateUserValidation };
