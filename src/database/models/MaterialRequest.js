const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require('../../config/database');

class MaterialRequest extends Model {
  static async generateRequestNumber() {
    const year = new Date().getFullYear();
    const last = await MaterialRequest.findOne({
      where: { requestNumber: { [Op.like]: `MR-${year}-%` } },
      order: [['createdAt', 'DESC']],
    });
    let next = 1;
    if (last) {
      const seq = parseInt(last.requestNumber.split('-')[2], 10);
      if (!isNaN(seq)) next = seq + 1;
    }
    return `MR-${year}-${String(next).padStart(3, '0')}`;
  }
}

MaterialRequest.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    requestNumber: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'request_number' },
    jobId: { type: DataTypes.UUID, allowNull: false, field: 'job_id' },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    notes: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    responseNotes: { type: DataTypes.TEXT, allowNull: true, field: 'response_notes' },
    respondedBy: { type: DataTypes.UUID, allowNull: true, field: 'responded_by' },
    respondedAt: { type: DataTypes.DATE, allowNull: true, field: 'responded_at' },
  },
  { sequelize, modelName: 'MaterialRequest', tableName: 'material_requests', timestamps: true, underscored: true }
);

module.exports = MaterialRequest;
