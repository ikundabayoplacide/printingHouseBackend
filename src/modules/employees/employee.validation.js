const { body } = require('express-validator');

const createEmployeeValidation = [
  body('fullName').notEmpty().withMessage('Full name is required').trim(),
  body('phoneNumber').notEmpty().withMessage('Phone number is required').trim(),
  body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('dateOfBirth').isISO8601().withMessage('dateOfBirth must be a valid date'),
  body('address').notEmpty().withMessage('Address is required').trim(),
  body('contractSalary').isFloat({ min: 0 }).withMessage('contractSalary must be 0 or greater'),
  body('contractType')
    .optional()
    .isIn(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'])
    .withMessage('contractType must be FULL_TIME, PART_TIME, CONTRACT, or INTERN'),
  body('nid').optional({ nullable: true }).trim(),
  body('email').optional({ nullable: true }).isEmail().withMessage('Must be a valid email'),
  body('supportContact').optional({ nullable: true }).trim(),
  body('bankAccount').optional({ nullable: true }).trim(),
  body('hiredAt').optional({ nullable: true }).isISO8601().withMessage('hiredAt must be a valid date'),
  body('departmentId').optional({ nullable: true }).isUUID().withMessage('departmentId must be a valid UUID'),
];

const updateEmployeeValidation = [
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty').trim(),
  body('phoneNumber').optional().notEmpty().withMessage('Phone number cannot be empty').trim(),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('dateOfBirth').optional().isISO8601().withMessage('dateOfBirth must be a valid date'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty').trim(),
  body('contractSalary').optional().isFloat({ min: 0 }).withMessage('contractSalary must be 0 or greater'),
  body('contractType')
    .optional()
    .isIn(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'])
    .withMessage('contractType must be FULL_TIME, PART_TIME, CONTRACT, or INTERN'),
  body('nid').optional({ nullable: true }).trim(),
  body('email').optional({ nullable: true }).isEmail().withMessage('Must be a valid email'),
  body('supportContact').optional({ nullable: true }).trim(),
  body('bankAccount').optional({ nullable: true }).trim(),
  body('hiredAt').optional({ nullable: true }).isISO8601().withMessage('hiredAt must be a valid date'),
  body('departmentId').optional({ nullable: true }).isUUID().withMessage('departmentId must be a valid UUID'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const assignJobValidation = [
  body('jobId').optional({ nullable: true }).isUUID().withMessage('jobId must be a valid UUID'),
];

module.exports = { createEmployeeValidation, updateEmployeeValidation, assignJobValidation };
