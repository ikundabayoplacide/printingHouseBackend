const Job = require('../database/models/Job');
const JobDocument = require('../database/models/JobDocument');
const User = require('../database/models/User');
const { success, error, paginated } = require('../utils/apiResponse');
const { getPagination } = require('../utils/helpers');

const docIncludes = [
  { model: User, as: 'uploadedBy', attributes: ['id', 'name', 'email', 'role'] },
];

/**
 * GET /api/jobs/:jobId/documents
 */
const getJobDocuments = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return error(res, 'Job not found.', 404);

    const { page, limit, skip } = getPagination(req.query);
    const { count, rows } = await JobDocument.findAndCountAll({
      where: { jobId: req.params.jobId },
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      include: docIncludes,
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/jobs/:jobId/documents/:id
 */
const getJobDocumentById = async (req, res, next) => {
  try {
    const doc = await JobDocument.findOne({
      where: { id: req.params.id, jobId: req.params.jobId },
      include: docIncludes,
    });
    if (!doc) return error(res, 'Document not found.', 404);
    return success(res, doc);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/jobs/:jobId/documents
 * Upload one or more documents to an existing job.
 */
const uploadJobDocuments = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return error(res, 'Job not found.', 404);

    if (!req.files || req.files.length === 0) {
      return error(res, 'No files uploaded.', 400);
    }

    const docs = await Promise.all(
      req.files.map((file) =>
        JobDocument.create({
          jobId: job.id,
          uploadedById: req.user.id,
          fileName: file.originalname,
          mimeType: file.mimetype,
          fileUrl: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        })
      )
    );

    const created = await JobDocument.findAll({
      where: { id: docs.map((d) => d.id) },
      include: docIncludes,
    });

    return success(res, created, `${created.length} document(s) uploaded successfully.`, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/jobs/:jobId/documents/:id
 */
const deleteJobDocument = async (req, res, next) => {
  try {
    const doc = await JobDocument.findOne({
      where: { id: req.params.id, jobId: req.params.jobId },
    });
    if (!doc) return error(res, 'Document not found.', 404);

    await doc.destroy();
    return success(res, null, 'Document deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getJobDocuments, getJobDocumentById, uploadJobDocuments, deleteJobDocument };
