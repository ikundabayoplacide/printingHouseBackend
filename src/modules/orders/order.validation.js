const { body } = require('express-validator');

const createOrderValidation = [
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('items.*.unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('items.*.specs').optional().trim(),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('notes').optional().trim(),
];

const updateOrderValidation = [
  body('status')
    .optional()
    .isIn(['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid order status'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('notes').optional().trim(),
  body('assignedToId').optional(),
];

module.exports = { createOrderValidation, updateOrderValidation };
