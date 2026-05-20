const { Op } = require('sequelize');
const BoutiqueProduct = require('../database/models/BoutiqueProduct');
const BoutiqueCategory = require('../database/models/BoutiqueCategory');
const BoutiqueStockMovement = require('../database/models/BoutiqueStockMovement');
const User = require('../database/models/User');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');

const productIncludes = [
  { model: BoutiqueCategory, as: 'category', attributes: ['id', 'name', 'skuPrefix', 'colorClass'] },
];

// ── Categories ────────────────────────────────────────────────────────────────

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await BoutiqueCategory.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    });
    return success(res, categories);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, skuPrefix, colorClass } = req.body;
    const existing = await BoutiqueCategory.findOne({ where: { name } });
    if (existing) return error(res, 'Category with this name already exists.', 409);

    const category = await BoutiqueCategory.create({ name, skuPrefix: skuPrefix.toUpperCase(), colorClass });
    return success(res, category, 'Category created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await BoutiqueCategory.findByPk(req.params.id);
    if (!category) return error(res, 'Category not found.', 404);

    const { name, skuPrefix, colorClass, isActive } = req.body;
    await category.update({
      ...(name !== undefined && { name }),
      ...(skuPrefix !== undefined && { skuPrefix: skuPrefix.toUpperCase() }),
      ...(colorClass !== undefined && { colorClass }),
      ...(isActive !== undefined && { isActive }),
    });
    return success(res, category, 'Category updated successfully.');
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await BoutiqueCategory.findByPk(req.params.id);
    if (!category) return error(res, 'Category not found.', 404);
    await category.update({ isActive: false });
    return success(res, null, 'Category deleted successfully.');
  } catch (err) {
    next(err);
  }
};

// ── Products ──────────────────────────────────────────────────────────────────

const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { categoryId, status, search } = req.query;

    const where = { isActive: true };
    if (categoryId) where.categoryId = categoryId;

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await BoutiqueProduct.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['name', 'ASC']],
      include: productIncludes,
    });

    // Attach computed status
    const data = rows.map((p) => ({
      ...p.toJSON(),
      status: p.status,
    }));

    // Filter by computed status if requested
    const filtered = status ? data.filter((p) => p.status === status) : data;

    return paginated(res, filtered, status ? filtered.length : count, page, limit);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await BoutiqueProduct.findByPk(req.params.id, { include: productIncludes });
    if (!product) return error(res, 'Product not found.', 404);
    return success(res, { ...product.toJSON(), status: product.status });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, categoryId, unit, price, stock, minStock } = req.body;

    const category = await BoutiqueCategory.findByPk(categoryId);
    if (!category) return error(res, 'Category not found.', 404);

    const sku = await BoutiqueProduct.generateSku(category.skuPrefix);

    const product = await BoutiqueProduct.create({
      sku, name, description, categoryId, unit, price,
      stock: stock || 0,
      minStock: minStock || 5,
    });

    // Record initial stock movement if stock > 0
    if (stock && stock > 0) {
      await BoutiqueStockMovement.create({
        productId: product.id,
        changedById: req.user.id,
        change: stock,
        reason: 'Initial stock',
        stockBefore: 0,
        stockAfter: stock,
      });
    }

    const created = await BoutiqueProduct.findByPk(product.id, { include: productIncludes });
    return success(res, { ...created.toJSON(), status: created.status }, 'Product created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await BoutiqueProduct.findByPk(req.params.id);
    if (!product) return error(res, 'Product not found.', 404);

    const { name, description, unit, price, minStock, isActive } = req.body;

    await product.update({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(unit !== undefined && { unit }),
      ...(price !== undefined && { price }),
      ...(minStock !== undefined && { minStock }),
      ...(isActive !== undefined && { isActive }),
    });

    const updated = await BoutiqueProduct.findByPk(product.id, { include: productIncludes });
    return success(res, { ...updated.toJSON(), status: updated.status }, 'Product updated successfully.');
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await BoutiqueProduct.findByPk(req.params.id);
    if (!product) return error(res, 'Product not found.', 404);
    await product.update({ isActive: false });
    return success(res, null, 'Product deleted successfully.');
  } catch (err) {
    next(err);
  }
};

// ── Stock Management ──────────────────────────────────────────────────────────

const updateStock = async (req, res, next) => {
  try {
    const product = await BoutiqueProduct.findByPk(req.params.id);
    if (!product) return error(res, 'Product not found.', 404);

    const { change, reason } = req.body;
    const stockBefore = product.stock;
    const stockAfter = stockBefore + change;

    if (stockAfter < 0) {
      return error(res, `Insufficient stock. Current stock: ${stockBefore}, requested change: ${change}.`, 422);
    }

    await product.update({ stock: stockAfter });

    await BoutiqueStockMovement.create({
      productId: product.id,
      changedById: req.user.id,
      change,
      reason,
      stockBefore,
      stockAfter,
    });

    const updated = await BoutiqueProduct.findByPk(product.id, { include: productIncludes });
    return success(res, { ...updated.toJSON(), status: updated.status }, 'Stock updated successfully.');
  } catch (err) {
    next(err);
  }
};

const getStockMovements = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const product = await BoutiqueProduct.findByPk(req.params.id);
    if (!product) return error(res, 'Product not found.', 404);

    const { count, rows } = await BoutiqueStockMovement.findAndCountAll({
      where: { productId: req.params.id },
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'changedBy', attributes: ['id', 'name', 'email', 'role'] }],
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCategories, createCategory, updateCategory, deleteCategory,
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct,
  updateStock, getStockMovements,
};
