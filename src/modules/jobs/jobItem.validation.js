const { body } = require('express-validator');

const addJobItemValidation = [
  body('stockItemId')
    .optional()
    .isUUID().withMessage('stockItemId must be a valid UUID'),
  body('itemName')
    .optional()
    .trim()
    .notEmpty().withMessage('itemName cannot be blank'),
  body().custom((_, { req }) => {
    if (!req.body.stockItemId && !req.body.itemName) {
      throw new Error('Either stockItemId or itemName is required');
    }
    return true;
  }),
  body('quantityNeeded')
    .notEmpty().withMessage('quantityNeeded is required')
    .isFloat({ min: 0.01 }).withMessage('quantityNeeded must be greater than 0'),
  body('unit').optional().trim(),
  body('unitCost').optional().isFloat({ min: 0 }).withMessage('unitCost must be a positive number'),
  body('notes').optional().trim(),
];

const updateJobItemValidation = [
  body('quantityNeeded')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('quantityNeeded must be greater than 0'),
  body('quantityUsed')
    .optional()
    .isFloat({ min: 0 }).withMessage('quantityUsed must be a positive number'),
  body('unitCost').optional().isFloat({ min: 0 }).withMessage('unitCost must be a positive number'),
  body('unit').optional().trim(),
  body('itemName').optional().trim().notEmpty().withMessage('itemName cannot be blank'),
  body('notes').optional().trim(),
];

module.exports = { addJobItemValidation, updateJobItemValidation };
