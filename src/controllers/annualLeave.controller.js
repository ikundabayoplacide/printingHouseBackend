const AnnualLeave = require('../database/models/AnnualLeave');
const User = require('../database/models/User');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function parseLeaveDate(str) {
  const [d, m, y] = str.trim().split('/');
  return new Date(`${y}-${m}-${d}`);
}

function calcDaysRemaining(periodStr) {
  if (!periodStr) return null;

  const parts = periodStr.split(/\s[–-]\s/);
  if (parts.length !== 2) return null;

  const start = parseLeaveDate(parts[0]);
  const end = parseLeaveDate(parts[1]);
  if (isNaN(start) || isNaN(end)) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  if (today < start) {
    return {
      status: 'upcoming',
      daysUntilStart: Math.round((start - today) / (1000 * 60 * 60 * 24)),
      totalDays,
    };
  }

  if (today <= end) {
    return {
      status: 'ongoing',
      daysRemaining: Math.round((end - today) / (1000 * 60 * 60 * 24)) + 1,
      totalDays,
    };
  }

  return {
    status: 'completed',
    daysAgo: Math.round((today - end) / (1000 * 60 * 60 * 24)),
    totalDays,
  };
}

function withCountdown(record) {
  const data = record.toJSON ? record.toJSON() : { ...record };
  data.firstLeaveCountdown = calcDaysRemaining(data.firstLeave);
  data.secondLeaveCountdown = calcDaysRemaining(data.secondLeave);
  return data;
}

const annualLeaveIncludes = [
  { model: User, as: 'createdBy', attributes: ['id', 'name', 'email', 'role'], required: false },
];

// ─────────────────────────────────────────────
// GET /api/annual-leaves
// ─────────────────────────────────────────────
const getAllAnnualLeaves = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { count, rows } = await AnnualLeave.findAndCountAll({
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: annualLeaveIncludes,
    });

    return paginated(res, rows.map(withCountdown), count, page, limit);
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

    return success(res, withCountdown(record));
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /api/annual-leaves/:id/countdown
// ─────────────────────────────────────────────
const getAnnualLeaveCountdown = async (req, res, next) => {
  try {
    const record = await AnnualLeave.findByPk(req.params.id, {
      attributes: ['id', 'fullNames', 'firstLeave', 'secondLeave', 'firstLeaveDays', 'secondLeaveDays'],
    });
    if (!record) return error(res, 'Annual leave record not found.', 404);

    return success(res, {
      id: record.id,
      fullNames: record.fullNames,
      firstLeaveCountdown: calcDaysRemaining(record.firstLeave),
      secondLeaveCountdown: calcDaysRemaining(record.secondLeave),
    });
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
  getAnnualLeaveCountdown,
  createAnnualLeave,
  updateAnnualLeave,
  deleteAnnualLeave,
  importAnnualLeaves,
};
