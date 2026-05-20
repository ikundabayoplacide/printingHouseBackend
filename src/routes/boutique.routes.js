const express = require('express');
const router = express.Router();

const {
  getAllCategories, createCategory, updateCategory, deleteCategory,
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct,
  updateStock, getStockMovements,
} = require('../controllers/boutique.controller');

const {
  createCategoryValidation, updateCategoryValidation,
  createProductValidation, updateProductValidation,
  updateStockValidation,
} = require('../modules/boutique/boutique.validation');

const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

// ── Categories ────────────────────────────────────────────────────────────────
router.get('/categories', getAllCategories);
router.post('/categories', authorize('ADMIN'), createCategoryValidation, validate, createCategory);
router.put('/categories/:id', authorize('ADMIN'), updateCategoryValidation, validate, updateCategory);
router.delete('/categories/:id', authorize('ADMIN'), deleteCategory);

// ── Products ──────────────────────────────────────────────────────────────────
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', authorize('ADMIN', 'STOCK'), createProductValidation, validate, createProduct);
router.put('/products/:id', authorize('ADMIN', 'STOCK'), updateProductValidation, validate, updateProduct);
router.delete('/products/:id', authorize('ADMIN'), deleteProduct);

// ── Stock Management ──────────────────────────────────────────────────────────
router.patch('/products/:id/stock', authorize('ADMIN', 'STOCK'), updateStockValidation, validate, updateStock);
router.get('/products/:id/stock-movements', getStockMovements);

module.exports = router;
