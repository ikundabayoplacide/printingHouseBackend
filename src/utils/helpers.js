/**
 * Generate a unique number with a given prefix
 * e.g. ORD-20240501-0001
 */
const generateNumber = (prefix) => {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${datePart}-${randomPart}`;
};

/**
 * Parse pagination query params with defaults
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build a case-insensitive search filter for Prisma
 */
const buildSearchFilter = (fields, searchTerm) => {
  if (!searchTerm) return {};
  return {
    OR: fields.map((field) => ({
      [field]: { contains: searchTerm, mode: 'insensitive' },
    })),
  };
};

module.exports = { generateNumber, getPagination, buildSearchFilter };
