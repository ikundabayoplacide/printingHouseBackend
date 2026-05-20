const express = require('express');
const router = express.Router();

const {
  getAllQuotations, getQuotationById, getQuotationsByJob,
  createQuotation, updateQuotation, updateQuotationStatus, deleteQuotation,
} = require('../controllers/quotation.controller');

const {
  createQuotationValidation, updateQuotationValidation, updateQuotationStatusValidation,
} = require('../modules/quotations/quotation.validation');

const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router.get('/', getAllQuotations);
router.get('/job/:jobId', getQuotationsByJob);
router.get('/:id', getQuotationById);
router.post('/', authorize('ADMIN', 'RECEPTIONIST', 'SALES'), createQuotationValidation, validate, createQuotation);
router.put('/:id', authorize('ADMIN', 'RECEPTIONIST', 'SALES'), updateQuotationValidation, validate, updateQuotation);
router.patch('/:id/status', authorize('ADMIN', 'RECEPTIONIST', 'SALES'), updateQuotationStatusValidation, validate, updateQuotationStatus);
router.delete('/:id', authorize('ADMIN', 'RECEPTIONIST'), deleteQuotation);

module.exports = router;
