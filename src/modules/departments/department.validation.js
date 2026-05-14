const { body } = require('express-validator');

const createDepartmentValidation = [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('description').optional().trim(),
];

const updateDepartmentValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

module.exports = { createDepartmentValidation, updateDepartmentValidation };
