const { body } = require('express-validator');

const createCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('skuPrefix').trim().notEmpty().withMessage('SKU prefix is required')
    .isLength({ max: 10 }).withMessage('SKU prefix must be 10 characters or less'),
  body('colorClass').optional().trim(),
];

const updateCategoryValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('skuPrefix').optional().trim().isLength({ max: 10 }).withMessage('SKU prefix must be 10 characters or less'),
  body('colorClass').optional().trim(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('categoryId').notEmpty().withMessage('categoryId is required').isUUID().withMessage('categoryId must be a valid UUID'),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price cannot be negative'),
  body('description').optional().trim(),
  body('unit').optional().trim(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('minStock').optional().isInt({ min: 0 }).withMessage('Min stock must be a non-negative integer'),
];

const updateProductValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().trim(),
  body('unit').optional().trim(),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price cannot be negative'),
  body('minStock').optional().isInt({ min: 0 }).withMessage('Min stock must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const updateStockValidation = [
  body('change').notEmpty().withMessage('change is required')
    .isInt().withMessage('change must be an integer (positive for restock, negative for sale/use)'),
  body('reason').trim().notEmpty().withMessage('reason is required'),
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
  createProductValidation,
  updateProductValidation,
  updateStockValidation,
};
