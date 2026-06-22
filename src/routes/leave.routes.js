const express = require('express');
const router = express.Router();
const { getMyLeaves, getAllLeaves, getLeaveById, createLeave, reviewLeave, cancelLeave, uploadDocument } = require('../controllers/leave.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const upload = require('../config/multer');

router.use(authenticate);

router.get('/my', getMyLeaves);
router.get('/', authorize('ADMIN', 'HR'), getAllLeaves);
router.get('/:id', getLeaveById);
router.post('/', createLeave);
router.post('/upload-document', upload.single('document'), uploadDocument);
router.patch('/:id/review', authorize('ADMIN', 'HR'), reviewLeave);
router.delete('/:id', cancelLeave);

module.exports = router;
