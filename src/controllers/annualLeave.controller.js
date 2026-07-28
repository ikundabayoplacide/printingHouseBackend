const AnnualLeave = require('../database/models/AnnualLeave');
const User = require('../database/models/User');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');

const annualLeaveIncludes = [
  { model: User, as: 'createdBy', attributes: ['id', 'name', 'email', 'role'], required: false },
  { model: User, as: 'approvedBy', attributes: ['id', 'name', 'email', 'role'], required: false },
];

// ─────────────────────────────────────────────
// GET /api/annual-leaves
// ─────────────────────────────────────────────
const getAllAnnualLeaves = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const where = {};
    if (req.query.status) where.status = req.query.status;

    const { count, rows } = await AnnualLeave.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: annualLeaveIncludes,
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /api/annual-leaves/:id
// ─────────────────────────────────────────────
const getAnnualLeaveById = async (req, res, next) => {
  try {
    const record = await AnnualLeave.findByPk(req.params.id, {
      include: annualLeaveIncludes,
    });
    if (!record) return error(res, 'Annual leave record not found.', 404);

    // Mark as viewed if not yet
    if (!record.viewedAt) {
      await record.update({ viewedAt: new Date(), status: record.status === 'PENDING' ? 'VIEWED' : record.status });
    }

    return success(res, record);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// POST /api/annual-leaves
// ─────────────────────────────────────────────
const createAnnualLeave = async (req, res, next) => {
  try {
    const { fullNames, firstLeave, secondLeave, phone, notes } = req.body;

    if (!fullNames) return error(res, 'fullNames is required.', 422);

    const docs = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : req.body.docs || null;

    const record = await AnnualLeave.create({
      fullNames,
      firstLeave: firstLeave || null,
      secondLeave: secondLeave || null,
      phone: phone || null,
      docs,
      notes: notes || null,
      createdById: req.user?.id || null,
    });

    const created = await AnnualLeave.findByPk(record.id, { include: annualLeaveIncludes });
    return success(res, created, 'Annual leave record created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PUT /api/annual-leaves/:id
// ─────────────────────────────────────────────
const updateAnnualLeave = async (req, res, next) => {
  try {
    const record = await AnnualLeave.findByPk(req.params.id);
    if (!record) return error(res, 'Annual leave record not found.', 404);

    const { fullNames, firstLeave, secondLeave, phone, notes } = req.body;

    const docs = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : req.body.docs !== undefined ? req.body.docs : undefined;

    await record.update({
      ...(fullNames !== undefined && { fullNames }),
      ...(firstLeave !== undefined && { firstLeave }),
      ...(secondLeave !== undefined && { secondLeave }),
      ...(phone !== undefined && { phone }),
      ...(notes !== undefined && { notes }),
      ...(docs !== undefined && { docs }),
      editedAt: new Date(),
    });

    const updated = await AnnualLeave.findByPk(record.id, { include: annualLeaveIncludes });
    return success(res, updated, 'Annual leave record updated successfully.');
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PATCH /api/annual-leaves/:id/status
// Body: { action: 'approve' | 'reject', notes? }
// ─────────────────────────────────────────────
const updateAnnualLeaveStatus = async (req, res, next) => {
  try {
    const record = await AnnualLeave.findByPk(req.params.id);
    if (!record) return error(res, 'Annual leave record not found.', 404);

    const { action, notes } = req.body;
    const normalizedAction = action ? String(action).toLowerCase().trim() : null;
    if (!['approve', 'reject'].includes(normalizedAction))
      return error(res, 'Action must be "approve" or "reject".', 422);

    if (normalizedAction === 'reject' && !notes)
      return error(res, 'Notes (rejection reason) are required when rejecting.', 422);

    const now = new Date();
    await record.update({
      status: normalizedAction === 'approve' ? 'APPROVED' : 'REJECTED',
      approvedById: req.user?.id || null,
      approvedAt: normalizedAction === 'approve' ? now : null,
      rejectedAt: normalizedAction === 'reject' ? now : null,
      notes: notes || record.notes,
    });

    const updated = await AnnualLeave.findByPk(record.id, { include: annualLeaveIncludes });
    return success(res, updated, `Annual leave record ${action}d successfully.`);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// DELETE /api/annual-leaves/:id
// ─────────────────────────────────────────────
const deleteAnnualLeave = async (req, res, next) => {
  try {
    const record = await AnnualLeave.findByPk(req.params.id);
    if (!record) return error(res, 'Annual leave record not found.', 404);

    await record.destroy();
    return success(res, null, 'Annual leave record deleted successfully.');
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// POST /api/annual-leaves/import
// Upload an Excel/CSV file and bulk-import rows
// ─────────────────────────────────────────────
const importAnnualLeaves = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded.', 400);

    const XLSX = require('xlsx');

    // Parse workbook from memory buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to array of arrays (raw, to skip merged header rows)
    const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    // Find the header row — look for a row containing "Noms" or "No"
    let headerIdx = -1;
    for (let i = 0; i < raw.length; i++) {
      const row = raw[i].map((c) => String(c).trim().toLowerCase());
      if (row.includes('noms') || row.includes('no')) {
        headerIdx = i;
        break;
      }
    }

    if (headerIdx === -1)
      return error(res, 'Could not find header row in the uploaded file. Expected columns: No, Noms, Dates de congés.', 422);

    const headers = raw[headerIdx].map((h) => String(h).trim().toLowerCase());
    const dataRows = raw.slice(headerIdx + 1).filter((r) => r.some((c) => c !== ''));

    // Map column indices
    const nomsIdx = headers.findIndex((h) => h.includes('noms') || h === 'nom');
    const date1Idx = headers.findIndex((h) => h.includes('dates de cong') || h.includes('date'));
    // Second date column is the one after the first
    const date2Idx = date1Idx !== -1
      ? headers.findIndex((h, i) => i > date1Idx && (h.includes('dates de cong') || h.includes('date')))
      : -1;

    if (nomsIdx === -1)
      return error(res, 'Could not find "Noms" column in the uploaded file.', 422);

    const records = [];
    for (const row of dataRows) {
      const fullNames = String(row[nomsIdx] || '').trim();
      if (!fullNames) continue;

      const firstLeave = date1Idx !== -1 ? String(row[date1Idx] || '').trim() || null : null;
      const secondLeave = date2Idx !== -1 ? String(row[date2Idx] || '').trim() || null : null;

      records.push({
        fullNames,
        firstLeave,
        secondLeave,
        createdById: req.user?.id || null,
        status: 'PENDING',
      });
    }

    if (records.length === 0)
      return error(res, 'No valid records found in the uploaded file.', 422);

    // bulkCreate — days are computed by beforeCreate hook
    const created = await AnnualLeave.bulkCreate(records, {
      individualHooks: true, // ensures beforeCreate fires for each row
    });

    return success(
      res,
      { imported: created.length, records: created },
      `${created.length} annual leave record(s) imported successfully.`,
      201
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllAnnualLeaves,
  getAnnualLeaveById,
  createAnnualLeave,
  updateAnnualLeave,
  updateAnnualLeaveStatus,
  deleteAnnualLeave,
  importAnnualLeaves,
};
