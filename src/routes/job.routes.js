const express = require('express');
const router = express.Router();

const {
  getNextJobNumber,
  getJobByNumber,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  assignJob,
  deleteJob,
} = require('../controllers/job.controller');

const {
  createJobValidation,
  updateJobValidation,
  updateJobStatusValidation,
  assignJobValidation,
} = require('../modules/jobs/job.validation');

const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// All job routes require authentication
router.use(authenticate);

// Preview next job number (no body mutation)
router.get('/next-number', getNextJobNumber);

// Find by job number (e.g. JOB-2026-001)
router.get('/number/:jobNumber', getJobByNumber);

// List & create
router.get('/', getAllJobs);
router.post('/', authorize('ADMIN', 'RECEPTIONIST'), createJobValidation, validate, createJob);

// Single job CRUD
router.get('/:id', getJobById);
router.put('/:id', authorize('ADMIN', 'RECEPTIONIST'), updateJobValidation, validate, updateJob);
router.delete('/:id', authorize('ADMIN'), deleteJob);

// Workflow actions
router.patch('/:id/status', authorize('ADMIN', 'RECEPTIONIST', 'PRINTEMPLOYEE', 'SUPERVISOR'), updateJobStatusValidation, validate, updateJobStatus);
router.post('/:id/assign', authorize('ADMIN', 'SUPERVISOR'), assignJobValidation, validate, assignJob);

module.exports = router;
