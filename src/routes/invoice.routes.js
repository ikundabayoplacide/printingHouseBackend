const express = require('express');
const router = express.Router();

const {
  getNextInvoiceNo,
  getAllInvoices,
  getInvoiceById,
  getInvoiceByNumber,
  createInvoice,
  updateInvoice,
  cancelInvoice,
  deleteInvoice,
} = require('../controllers/invoice.controller');

const { createInvoiceValidation, updateInvoiceValidation } = require('../modules/invoices/invoice.validation');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// All invoice routes require authentication
router.use(authenticate);

// Preview next invoice number
router.get('/next-number', getNextInvoiceNo);

// Find by invoice number (e.g. INV-2026-001)
router.get('/number/:invoiceNo', getInvoiceByNumber);

// List & create
router.get('/', getAllInvoices);
router.post('/', authorize('ADMIN', 'RECEPTIONIST', 'SALES', 'ACCOUNTANT'), createInvoiceValidation, validate, createInvoice);

// Single invoice CRUD
router.get('/:id', getInvoiceById);
router.put('/:id', authorize('ADMIN', 'RECEPTIONIST', 'SALES', 'ACCOUNTANT'), updateInvoiceValidation, validate, updateInvoice);
router.delete('/:id', authorize('ADMIN', 'ACCOUNTANT'), deleteInvoice);

// Workflow actions
router.patch('/:id/cancel', authorize('ADMIN', 'ACCOUNTANT'), cancelInvoice);

module.exports = router;
