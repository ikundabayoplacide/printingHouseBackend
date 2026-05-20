const { body } = require('express-validator');

const addJobItemValidation = [
  body('stockItemId')
    .notEmpty().withMessage('stockItemId is required')
    .isUUID().withMessage('stockItemId must be a valid UUID'),
  body('quantityNeeded')
    .notEmpty().withMessage('quantityNeeded is required')
    .isFloat({ min: 0.01 }).withMessage('quantityNeeded must be greater than 0'),
  body('notes').optional().trim(),
];

const updateJobItemValidation = [
  body('quantityNeeded')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('quantityNeeded must be greater than 0'),
  body('quantityUsed')
    .optional()
    .isFloat({ min: 0 }).withMessage('quantityUsed must be a positive number'),
  body('notes').optional().trim(),
];

module.exports = { addJobItemValidation, updateJobItemValidation };
