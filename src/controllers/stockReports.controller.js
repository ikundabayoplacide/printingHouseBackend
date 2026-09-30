const { Op } = require("sequelize");
const GeneralStockItem = require("../database/models/GeneralStockItem");
const GeneralStockEntry = require("../database/models/GeneralStockEntry");
const GeneralStockSortie = require("../database/models/GeneralStockSortie");
const BoutiqueStockItem = require("../database/models/BoutiqueStockItem");
const BoutiqueStockEntry = require("../database/models/BoutiqueStockEntry");
const BoutiqueStockSortie = require("../database/models/BoutiqueStockSortie");
const User = require("../database/models/User");
const { success, error } = require("../utils/apiResponse");

/**
 * Helper: Get date range for interval or custom dates
 */
const getDateRange = (interval, customFrom, customTo) => {
  // If custom dates provided, use them
  if (customFrom && customTo) {
    return {
      startDate: new Date(customFrom + "T00:00:00"),
      endDate: new Date(customTo + "T23:59:59.999"),
      isCustom: true,
    };
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  let startDate, endDate;

  switch (interval) {
    case "daily":
      startDate = new Date(year, month, day, 0, 0, 0, 0);
      endDate = new Date(year, month, day, 23, 59, 59, 999);
      break;

    case "weekly":
      // Last 7 days
      startDate = new Date(year, month, day - 6, 0, 0, 0, 0);
      endDate = new Date(year, month, day, 23, 59, 59, 999);
      break;

    case "monthly":
      // Current month
      startDate = new Date(year, month, 1, 0, 0, 0, 0);
      endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
      break;

    case "annual":
      // Current year
      startDate = new Date(year, 0, 1, 0, 0, 0, 0);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      break;

    default:
      // Default to monthly
      startDate = new Date(year, month, 1, 0, 0, 0, 0);
      endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
  }

  return { startDate, endDate, isCustom: false };
};

/**
 * Generic stock report generator
 */
const generateStockReport = async (
  StockItem,
  StockEntry,
  StockSortie,
  interval,
  customFrom,
  customTo,
  filters = {},
) => {
  const { startDate, endDate, isCustom } = getDateRange(
    interval,
    customFrom,
    customTo,
  );

  // Build where clause for items based on filters
  const itemWhere = { isActive: true };
  if (filters.category) {
    itemWhere.category = filters.category;
  }
  if (filters.stockStatus) {
    // Will filter after fetching based on computed stockStatus
  }

  // Get all active items
  const items = await StockItem.findAll({
    where: itemWhere,
    attributes: [
      "id",
      "itemName",
      "category",
      "unit",
      "currentStock",
      "unitCost",
      "alarmStock",
      "supplier",
    ],
    order: [["itemName", "ASC"]],
  });

  // Get entries in period
  const entries = await StockEntry.findAll({
    where: {
      entryDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: StockItem,
        as: "stockItem",
        attributes: ["id", "itemName", "unit"],
      },
      { model: User, as: "receivedBy", attributes: ["id", "name"] },
    ],
    order: [["entryDate", "DESC"]],
  });

  // Get sorties in period
  const sorties = await StockSortie.findAll({
    where: {
      sortieDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: StockItem,
        as: "stockItem",
        attributes: ["id", "itemName", "unit"],
      },
      { model: User, as: "requester", attributes: ["id", "name", "role"] },
      { model: User, as: "approvedBy", attributes: ["id", "name"] },
    ],
    order: [["sortieDate", "DESC"]],
  });

  // Filter by stock status if requested
  let filteredItems = items;
  if (filters.stockStatus) {
    filteredItems = items.filter((item) => {
      const current = parseFloat(item.currentStock) || 0;
      const alarm = parseFloat(item.alarmStock) || 5;

      if (filters.stockStatus === "low") {
        return current <= alarm && current > 0;
      } else if (filters.stockStatus === "out") {
        return current === 0;
      } else if (filters.stockStatus === "normal") {
        return current > alarm;
      }
      return true;
    });
  }

  // Calculate summary statistics
  const totalItems = filteredItems.length;
  const lowStockItems = filteredItems.filter((item) => {
    const current = parseFloat(item.currentStock) || 0;
    const alarm = parseFloat(item.alarmStock) || 5;
    return current <= alarm && current > 0;
  });
  const outOfStockItems = filteredItems.filter(
    (item) => parseFloat(item.currentStock) === 0,
  );

  const totalEntriesQuantity = entries.reduce(
    (sum, e) => sum + (parseFloat(e.quantityIn) || 0),
    0,
  );
  const totalEntriesValue = entries.reduce(
    (sum, e) => sum + (parseFloat(e.totalCost) || 0),
    0,
  );

  const totalSortiesQuantity = sorties.reduce(
    (sum, s) => sum + (parseFloat(s.quantityOut) || 0),
    0,
  );
  const approvedSorties = sorties.filter(
    (s) => s.status === "approved" || s.status === "taken",
  );
  const pendingSorties = sorties.filter((s) => s.status === "pending");
  const rejectedSorties = sorties.filter((s) => s.status === "rejected");

  const totalStockValue = filteredItems.reduce((sum, item) => {
    const stock = parseFloat(item.currentStock) || 0;
    const cost = parseFloat(item.unitCost) || 0;
    return sum + stock * cost;
  }, 0);

  // Group entries by item
  const entriesByItem = entries.reduce((acc, entry) => {
    const itemId = entry.stockItemId;
    if (!acc[itemId]) {
      acc[itemId] = {
        itemName: entry.stockItem?.itemName || "Unknown",
        unit: entry.stockItem?.unit || "",
        totalQuantity: 0,
        totalValue: 0,
        count: 0,
      };
    }
    acc[itemId].totalQuantity += parseFloat(entry.quantityIn) || 0;
    acc[itemId].totalValue += parseFloat(entry.totalCost) || 0;
    acc[itemId].count += 1;
    return acc;
  }, {});

  // Group sorties by item
  const sortiesByItem = sorties.reduce((acc, sortie) => {
    const itemId = sortie.stockItemId;
    if (!acc[itemId]) {
      acc[itemId] = {
        itemName: sortie.stockItem?.itemName || "Unknown",
        unit: sortie.stockItem?.unit || "",
        totalQuantity: 0,
        count: 0,
      };
    }
    acc[itemId].totalQuantity += parseFloat(sortie.quantityOut) || 0;
    acc[itemId].count += 1;
    return acc;
  }, {});

  // Top 5 most requested items
  const topRequestedItems = Object.values(sortiesByItem)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);

  // Top 5 most received items
  const topReceivedItems = Object.values(entriesByItem)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);

  return {
    interval: isCustom ? "custom" : interval,
    period: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    filters: {
      category: filters.category || "all",
      stockStatus: filters.stockStatus || "all",
    },
    summary: {
      totalItems,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalStockValue: parseFloat(totalStockValue.toFixed(2)),
      entries: {
        count: entries.length,
        totalQuantity: parseFloat(totalEntriesQuantity.toFixed(2)),
        totalValue: parseFloat(totalEntriesValue.toFixed(2)),
      },
      sorties: {
        total: sorties.length,
        approved: approvedSorties.length,
        pending: pendingSorties.length,
        rejected: rejectedSorties.length,
        totalQuantity: parseFloat(totalSortiesQuantity.toFixed(2)),
      },
    },
    stockStatus: {
      lowStock: lowStockItems.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        category: item.category,
        currentStock: item.currentStock,
        alarmStock: item.alarmStock,
        unit: item.unit,
      })),
      outOfStock: outOfStockItems.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        category: item.category,
        unit: item.unit,
      })),
    },
    topItems: {
      mostRequested: topRequestedItems,
      mostReceived: topReceivedItems,
    },
    recentEntries: entries.slice(0, 10).map((e) => ({
      id: e.id,
      itemName: e.stockItem?.itemName,
      quantity: e.quantityIn,
      unitCost: e.unitCost,
      totalCost: e.totalCost,
      receivedBy: e.receivedBy?.name,
      entryDate: e.entryDate,
      supplier: e.supplier,
    })),
    recentSorties: sorties.slice(0, 10).map((s) => ({
      id: s.id,
      itemName: s.stockItem?.itemName,
      quantityOut: s.quantityOut,
      status: s.status,
      requester: s.requester?.name,
      requesterRole: s.requester?.role,
      approvedBy: s.approvedBy?.name,
      sortieDate: s.sortieDate,
      takenAt: s.takenAt,
      reason: s.reason,
    })),
  };
};

/**
 * GET /api/stock-reports/general?interval=daily&from=2024-01-01&to=2024-01-31&category=Paper&stockStatus=low
 * Generate interval report for General Stock
 */
const getGeneralStockReport = async (req, res, next) => {
  try {
    const { interval = "monthly", from, to, category, stockStatus } = req.query;

    if (
      !from &&
      !to &&
      !["daily", "weekly", "monthly", "annual"].includes(interval)
    ) {
      return error(
        res,
        "Invalid interval. Must be: daily, weekly, monthly, or annual",
        400,
      );
    }

    const report = await generateStockReport(
      GeneralStockItem,
      GeneralStockEntry,
      GeneralStockSortie,
      interval,
      from,
      to,
      { category, stockStatus },
    );

    return success(
      res,
      {
        stockType: "General Stock",
        ...report,
      },
      `Report generated successfully.`,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/stock-reports/boutique?interval=daily&from=2024-01-01&to=2024-01-31&category=Books&stockStatus=out
 * Generate interval report for Boutique Stock
 */
const getBoutiqueStockReport = async (req, res, next) => {
  try {
    const { interval = "monthly", from, to, category, stockStatus } = req.query;

    if (
      !from &&
      !to &&
      !["daily", "weekly", "monthly", "annual"].includes(interval)
    ) {
      return error(
        res,
        "Invalid interval. Must be: daily, weekly, monthly, or annual",
        400,
      );
    }

    const report = await generateStockReport(
      BoutiqueStockItem,
      BoutiqueStockEntry,
      BoutiqueStockSortie,
      interval,
      from,
      to,
      { category, stockStatus },
    );

    return success(
      res,
      {
        stockType: "Boutique Stock",
        ...report,
      },
      `Report generated successfully.`,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/stock-reports/comparison?interval=monthly
 * Compare General and Boutique stock
 */
const getComparativeReport = async (req, res, next) => {
  try {
    const { interval = "monthly" } = req.query;

    if (!["daily", "weekly", "monthly", "annual"].includes(interval)) {
      return error(
        res,
        "Invalid interval. Must be: daily, weekly, monthly, or annual",
        400,
      );
    }

    const generalReport = await generateStockReport(
      GeneralStockItem,
      GeneralStockEntry,
      GeneralStockSortie,
      interval,
    );

    const boutiqueReport = await generateStockReport(
      BoutiqueStockItem,
      BoutiqueStockEntry,
      BoutiqueStockSortie,
      interval,
    );

    return success(
      res,
      {
        interval,
        period: generalReport.period,
        comparison: {
          general: {
            stockType: "General Stock",
            summary: generalReport.summary,
          },
          boutique: {
            stockType: "Boutique Stock",
            summary: boutiqueReport.summary,
          },
        },
        details: {
          general: generalReport,
          boutique: boutiqueReport,
        },
      },
      "Comparative report generated successfully.",
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGeneralStockReport,
  getBoutiqueStockReport,
  getComparativeReport,
};
