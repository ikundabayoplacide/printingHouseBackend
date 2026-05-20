const { body } = require('express-validator');

const createItemValidation = [
  body('itemName').trim().notEmpty().withMessage('Item name is required'),
  body('category').optional().trim(),
  body('unit').optional().trim(),
  body('description').optional().trim(),
  body('supplier').optional().trim(),
  body('unitCost').optional().isFloat({ min: 0 }).withMessage('Unit cost must be a positive number'),
  body('currentStock').optional().isFloat({ min: 0 }).withMessage('Current stock must be a positive number'),
  body('alarmStock').optional().isFloat({ min: 0 }).withMessage('Alarm stock must be a positive number'),
];

const updateItemValidation = [
  body('itemName').optional().trim().notEmpty().withMessage('Item name cannot be empty'),
  body('category').optional().trim(),
  body('unit').optional().trim(),
  body('description').optional().trim(),
  body('supplier').optional().trim(),
  body('unitCost').optional().isFloat({ min: 0 }).withMessage('Unit cost must be a positive number'),
  body('alarmStock').optional().isFloat({ min: 0 }).withMessage('Alarm stock must be a positive number'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const createEntryValidation = [
  body('stockItemId').notEmpty().withMessage('stockItemId is required').isUUID().withMessage('stockItemId must be a valid UUID'),
  body('quantityIn').notEmpty().withMessage('quantityIn is required').isFloat({ min: 0.01 }).withMessage('quantityIn must be greater than 0'),
  body('unitCost').optional().isFloat({ min: 0 }).withMessage('Unit cost must be a positive number'),
  body('supplier').optional().trim(),
  body('referenceNo').optional().trim(),
  body('notes').optional().trim(),
  body('entryDate').optional().isISO8601().withMessage('entryDate must be a valid ISO 8601 date'),
];

const createSortieValidation = [
  body('stockItemId').notEmpty().withMessage('stockItemId is required').isUUID().withMessage('stockItemId must be a valid UUID'),
  body('quantityOut').notEmpty().withMessage('quantityOut is required').isFloat({ min: 0.01 }).withMessage('quantityOut must be greater than 0'),
  body('jobId').optional().isUUID().withMessage('jobId must be a valid UUID'),
  body('dossierNo').optional().trim(),
  body('reason').optional().trim(),
  body('notes').optional().trim(),
  body('sortieDate').optional().isISO8601().withMessage('sortieDate must be a valid ISO 8601 date'),
];

module.exports = {
  createItemValidation,
  updateItemValidation,
  createEntryValidation,
  createSortieValidation,
};
