const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require('../../config/database');

class Quotation extends Model {
  static async generateQuotationNo() {
    const year = new Date().getFullYear();
    const last = await Quotation.findOne({
      where: { quotationNo: { [Op.like]: `QT-${year}-%` } },
      order: [['createdAt', 'DESC']],
    });

    let nextNumber = 1;
    if (last) {
      const parts = last.quotationNo.split('-');
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) nextNumber = lastSeq + 1;
    }

    return `QT-${year}-${String(nextNumber).padStart(3, '0')}`;
  }
}

Quotation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quotationNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Auto-generated e.g. QT-2026-001',
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Amount before tax and discount',
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Tax percentage e.g. 18 for 18%',
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Computed: subtotal * taxRate / 100',
    },
    discount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Discount amount in RWF',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Computed: subtotal + taxAmount - discount',
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired'),
      defaultValue: 'draft',
      allowNull: false,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Expiry date of the quotation',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Terms and conditions for this quotation',
    },
  },
  {
    sequelize,
    modelName: 'Quotation',
    tableName: 'quotations',
    timestamps: true,
  }
);

module.exports = Quotation;
