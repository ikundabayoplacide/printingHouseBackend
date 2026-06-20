const express = require('express');
const router = express.Router();

const { getDebtList, getRecoveryRecords, createRecoveryRecord, updateRecoveryStatus } = require('../controllers/recovery.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

const allowed = ['ADMIN', 'DAF', 'ACCOUNTANT', 'RECEPTIONIST'];

router.get('/debts', authorize(...allowed), getDebtList);
router.get('/records', authorize(...allowed), getRecoveryRecords);
router.post('/', authorize(...allowed), createRecoveryRecord);
router.patch('/:id/status', authorize('ADMIN', 'DAF', 'ACCOUNTANT'), updateRecoveryStatus);

module.exports = router;
