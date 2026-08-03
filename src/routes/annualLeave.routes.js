const express = require('express');
const router = express.Router();

const {
  getAllAnnualLeaves,
  getAnnualLeaveById,
  getAnnualLeaveCountdown,
  createAnnualLeave,
  updateAnnualLeave,
  deleteAnnualLeave,
  importAnnualLeaves,
} = require('../controllers/annualLeave.controller');

const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const upload = require('../config/multer');

router.use(authenticate);

// Import from Excel — must come before /:id to avoid route collision
router.post('/import', authorize('ADMIN', 'HR', 'DAF'), upload.single('file'), importAnnualLeaves);

// CRUD
router.get('/', getAllAnnualLeaves);
router.post('/', upload.single('docs'), createAnnualLeave);
router.get('/:id/countdown', getAnnualLeaveCountdown);
router.get('/:id', getAnnualLeaveById);
router.put('/:id', upload.single('docs'), updateAnnualLeave);
router.delete('/:id', authorize('ADMIN', 'HR'), deleteAnnualLeave);

module.exports = router;
