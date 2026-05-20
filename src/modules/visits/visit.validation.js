const { body } = require('express-validator');

const checkInValidation = [
  body('customerId')
    .notEmpty().withMessage('customerId is required')
    .isUUID().withMessage('customerId must be a valid UUID'),
  body('purpose').optional().trim(),
  body('notes').optional().trim(),
];

module.exports = { checkInValidation };
