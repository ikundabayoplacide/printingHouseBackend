const { body } = require('express-validator');

const createCustomerValidation = [
  body('name').trim().notEmpty().withMessage('Customer name is required'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone number is required').trim().isLength({ min: 7, max: 20 }).withMessage('Phone number must be between 7 and 20 characters'),
  body('company').optional().trim(),
  body('tin').optional().trim(),
  body('address').optional().trim(),
  body('notes').optional().trim(),
  body('type').optional().isIn(['BUSINESS', 'VISITOR', 'BOUTIQUE', 'HOBE']).withMessage('Type must be BUSINESS, VISITOR, BOUTIQUE or HOBE'),
];

const updateCustomerValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim().isLength({ min: 7, max: 20 }).withMessage('Phone number must be between 7 and 20 characters'),
  body('company').optional().trim(),
  body('tin').optional().trim(),
  body('address').optional().trim(),
  body('notes').optional().trim(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

module.exports = { createCustomerValidation, updateCustomerValidation };
