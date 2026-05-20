const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :jobId from parent

const { getJobItems, addJobItem, updateJobItem, removeJobItem } = require('../controllers/jobItem.controller');
const { addJobItemValidation, updateJobItemValidation } = require('../modules/jobs/jobItem.validation');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router.get('/', getJobItems);
router.post('/', authorize('ADMIN', 'RECEPTIONIST', 'SALES'), addJobItemValidation, validate, addJobItem);
router.put('/:id', authorize('ADMIN', 'RECEPTIONIST', 'SALES', 'SUPERVISOR'), updateJobItemValidation, validate, updateJobItem);
router.delete('/:id', authorize('ADMIN', 'RECEPTIONIST', 'SALES'), removeJobItem);

module.exports = router;
