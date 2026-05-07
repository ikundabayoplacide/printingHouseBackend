const { body } = require('express-validator');

const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('basePrice')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  body('description').optional().trim(),
  body('unit').optional().trim(),
];

const updateProductValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('basePrice').optional().isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('description').optional().trim(),
  body('unit').optional().trim(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

module.exports = { createProductValidation, updateProductValidation };
