const { body } = require('express-validator');

const STAGES = ['prospect', 'contacted', 'negotiating', 'won', 'lost'];

const createLeadValidation = [
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Must be a valid email address'),
  body('sector').optional().trim(),
  body('stage').optional().isIn(STAGES).withMessage(`Stage must be one of: ${STAGES.join(', ')}`),
  body('estimatedValue').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Estimated value must be a positive number'),
  body('location').optional().trim(),
  body('nextFollowUp').optional({ checkFalsy: true }).isISO8601().withMessage('nextFollowUp must be a valid ISO 8601 date'),
  body('notes').optional().trim(),
];

const updateLeadValidation = [
  body('company').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
  body('contactPerson').optional().trim().notEmpty().withMessage('Contact person cannot be empty'),
  body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Must be a valid email address'),
  body('sector').optional().trim(),
  body('stage').optional().isIn(STAGES).withMessage(`Stage must be one of: ${STAGES.join(', ')}`),
  body('estimatedValue').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Estimated value must be a positive number'),
  body('location').optional().trim(),
  body('nextFollowUp').optional({ checkFalsy: true }).isISO8601().withMessage('nextFollowUp must be a valid ISO 8601 date'),
  body('notes').optional().trim(),
];

const updateLeadStageValidation = [
  body('stage').notEmpty().withMessage('Stage is required').isIn(STAGES).withMessage(`Stage must be one of: ${STAGES.join(', ')}`),
];

module.exports = { createLeadValidation, updateLeadValidation, updateLeadStageValidation };
