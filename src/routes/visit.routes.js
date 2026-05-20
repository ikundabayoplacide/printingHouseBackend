const express = require('express');
const router = express.Router();

const { getAllVisits, getVisitById, getVisitsByCustomer, checkIn, checkOut, deleteVisit } = require('../controllers/customerVisit.controller');
const { checkInValidation } = require('../modules/visits/visit.validation');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router.get('/', getAllVisits);
router.get('/customer/:customerId', getVisitsByCustomer);
router.get('/:id', getVisitById);
router.post('/checkin', authorize('ADMIN', 'RECEPTIONIST'), checkInValidation, validate, checkIn);
router.patch('/:id/checkout', authorize('ADMIN', 'RECEPTIONIST'), checkOut);
router.delete('/:id', authorize('ADMIN'), deleteVisit);

module.exports = router;
