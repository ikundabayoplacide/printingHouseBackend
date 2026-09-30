const express = require("express");
const router = express.Router();

const {
  getGeneralStockReport,
  getBoutiqueStockReport,
  getComparativeReport,
} = require("../controllers/stockReports.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/stock-reports/general?interval=daily|weekly|monthly|annual
 * Generate interval report for General Stock
 */
router.get(
  "/general",
  authorize("ADMIN", "STOCK", "DAF", "PRODUCTION_MANAGER"),
  getGeneralStockReport,
);

/**
 * GET /api/stock-reports/boutique?interval=daily|weekly|monthly|annual
 * Generate interval report for Boutique Stock
 */
router.get(
  "/boutique",
  authorize("ADMIN", "STOCK", "DAF", "RECEPTIONIST"),
  getBoutiqueStockReport,
);

/**
 * GET /api/stock-reports/comparison?interval=monthly
 * Generate comparative report for both General and Boutique stock
 */
router.get("/comparison", authorize("ADMIN", "DAF"), getComparativeReport);

module.exports = router;
