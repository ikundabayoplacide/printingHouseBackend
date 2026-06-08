const express = require('express');
const router = express.Router();

const { getMyRequests, getAllRequests, createRequest, approveRequest, rejectRequest } = require('../controllers/materialRequest.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router.get('/my', authorize('WORKER', 'PRINTEMPLOYEE'), getMyRequests);
router.get('/', authorize('ADMIN', 'SUPERVISOR', 'STOCK_MANAGER'), getAllRequests);
router.post('/', authorize('WORKER', 'PRINTEMPLOYEE'), createRequest);
router.patch('/:id/approve', authorize('ADMIN', 'SUPERVISOR', 'STOCK_MANAGER'), approveRequest);
router.patch('/:id/reject', authorize('ADMIN', 'SUPERVISOR', 'STOCK_MANAGER'), rejectRequest);

module.exports = router;
