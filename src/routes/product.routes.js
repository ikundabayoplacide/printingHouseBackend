const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { createProductValidation, updateProductValidation } = require('../modules/products/product.validation');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authorize('ADMIN', 'STOREKEEPER', 'RECEPTIONIST'), createProductValidation, validate, createProduct);
router.put('/:id', authorize('ADMIN', 'STOREKEEPER'), updateProductValidation, validate, updateProduct);
router.delete('/:id', authorize('ADMIN'), deleteProduct);

module.exports = router;
