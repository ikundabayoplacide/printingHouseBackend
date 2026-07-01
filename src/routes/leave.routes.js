const express = require('express');
const router = express.Router();
const { getMyLeaves, getAllLeaves, getLeaveById, createLeave, updateLeave, reviewLeave, cancelLeave, uploadDocument } = require('../controllers/leave.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const upload = require('../config/multer');

router.use(authenticate);

router.get('/my', getMyLeaves);
router.get('/', authorize('ADMIN', 'HR', 'DAF'), getAllLeaves);
router.get('/:id', getLeaveById);
router.post('/', upload.single('document'), createLeave);
router.put('/:id', upload.single('document'), updateLeave);
router.post('/upload-document', upload.single('document'), uploadDocument);
router.patch('/:id/review', authorize('ADMIN', 'HR', 'DAF'), reviewLeave);
router.delete('/:id', cancelLeave);

module.exports = router;
