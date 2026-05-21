const { body } = require('express-validator');

const JOB_STATUSES = [
  'pending',
  'confirmed',
  'rejected',
  'in-composition',
  'in-montage',
  'in-printing',
  'in-binding',
  'in-packaging',
  'quality-check',
  'ready-for-delivery',
  'delivered',
  'completed',
];

const createJobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('customerId').notEmpty().withMessage('Customer ID is required').isUUID().withMessage('Customer ID must be a valid UUID'),
  body('description').optional().trim(),
  body('jobType').optional().trim(),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('size').optional().trim(),
  body('colorMode').optional().trim(),
  body('bindingType').optional().trim(),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, normal, high, urgent'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
  body('notes').optional().trim(),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
];

const updateJobValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('jobType').optional().trim(),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('size').optional().trim(),
  body('colorMode').optional().trim(),
  body('bindingType').optional().trim(),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, normal, high, urgent'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
  body('notes').optional().trim(),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('departmentAssignedToId').optional().isUUID().withMessage('departmentAssignedToId must be a valid UUID'),
];

const updateJobStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(JOB_STATUSES)
    .withMessage(`Status must be one of: ${JOB_STATUSES.join(', ')}`),
];

const assignJobValidation = [
  body('departmentAssignedToId')
    .notEmpty()
    .withMessage('departmentAssignedToId is required')
    .isUUID()
    .withMessage('departmentAssignedToId must be a valid UUID'),
];

const rejectJobValidation = [
  body('rejectReason').optional().trim().isLength({ max: 1000 }).withMessage('Reject reason must not exceed 1000 characters'),
];

module.exports = {
  createJobValidation,
  updateJobValidation,
  updateJobStatusValidation,
  assignJobValidation,
  rejectJobValidation,
};
