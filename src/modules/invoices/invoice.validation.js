const { body } = require('express-validator');

const lineItemRules = [
  body('lineItems').isArray({ min: 1 }).withMessage('lineItems must be a non-empty array'),
  body('lineItems.*.name').notEmpty().withMessage('Each line item must have a name'),
  body('lineItems.*.quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Each line item quantity must be greater than 0'),
  body('lineItems.*.unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Each line item unitPrice must be 0 or greater'),
];

const createInvoiceValidation = [
  body('jobId').isUUID().withMessage('jobId must be a valid UUID'),
  body('customerId').isUUID().withMessage('customerId must be a valid UUID'),
  ...lineItemRules,
  body('discountType')
    .optional({ nullable: true })
    .isIn(['FIXED', 'PERCENTAGE'])
    .withMessage('discountType must be FIXED or PERCENTAGE'),
  body('discountValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('discountValue must be 0 or greater'),
  body('taxRate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('taxRate must be between 0 and 100'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('dueDate must be a valid date'),
];

const updateInvoiceValidation = [
  body('lineItems')
    .optional()
    .isArray({ min: 1 })
    .withMessage('lineItems must be a non-empty array'),
  body('lineItems.*.name')
    .if(body('lineItems').exists())
    .notEmpty()
    .withMessage('Each line item must have a name'),
  body('lineItems.*.quantity')
    .if(body('lineItems').exists())
    .isFloat({ min: 0.01 })
    .withMessage('Each line item quantity must be greater than 0'),
  body('lineItems.*.unitPrice')
    .if(body('lineItems').exists())
    .isFloat({ min: 0 })
    .withMessage('Each line item unitPrice must be 0 or greater'),
  body('discountType')
    .optional({ nullable: true })
    .isIn(['FIXED', 'PERCENTAGE'])
    .withMessage('discountType must be FIXED or PERCENTAGE'),
  body('discountValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('discountValue must be 0 or greater'),
  body('taxRate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('taxRate must be between 0 and 100'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('dueDate must be a valid date'),
];

module.exports = { createInvoiceValidation, updateInvoiceValidation };
