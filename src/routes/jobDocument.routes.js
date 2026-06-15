const express = require('express');
const router = express.Router({ mergeParams: true });

const { getJobDocuments, getJobDocumentById, uploadJobDocuments, deleteJobDocument } = require('../controllers/jobDocument.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const upload = require('../config/multer');

router.use(authenticate);

router.get('/', getJobDocuments);
router.get('/:id', getJobDocumentById);
router.post('/', authorize('ADMIN', 'RECEPTIONIST', 'SALES', 'SUPERVISOR'), upload.array('documents', 10), uploadJobDocuments);
router.delete('/:id', authorize('ADMIN', 'RECEPTIONIST', 'SALES', 'SUPERVISOR'), deleteJobDocument);

module.exports = router;
