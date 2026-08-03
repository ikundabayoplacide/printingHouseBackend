const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/database');

/**
 * Helper: parse "DD/MM/YYYY - DD/MM/YYYY" and return number of calendar days (inclusive)
 */
function calcLeaveDays(periodStr) {
  if (!periodStr) return 0;
  // support both " - " and " – " (en-dash)
  const parts = periodStr.split(/\s[–-]\s/);
  if (parts.length !== 2) return 0;

  const parseDate = (str) => {
    const [d, m, y] = str.trim().split('/');
    return new Date(`${y}-${m}-${d}`);
  };

  const start = parseDate(parts[0]);
  const end = parseDate(parts[1]);
  if (isNaN(start) || isNaN(end) || end < start) return 0;

  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1; // inclusive
  return diff;
}

class AnnualLeave extends Model {
  /**
   * Recompute and persist leave day counts from the period strings
   */
  async recalcDays() {
    this.firstLeaveDays = calcLeaveDays(this.firstLeave);
    this.secondLeaveDays = calcLeaveDays(this.secondLeave);
    await this.save();
  }

  /** Total days across both periods */
  get totalLeaveDays() {
    return (this.firstLeaveDays || 0) + (this.secondLeaveDays || 0);
  }
}

AnnualLeave.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullNames: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Full name is required' },
      },
    },
    firstLeave: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'First leave period string e.g. "12/07/2026 - 31/07/2026"',
    },
    secondLeave: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Second leave period string e.g. "01/11/2026 - 10/11/2026"',
    },
    firstLeaveDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    secondLeaveDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    docs: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'AnnualLeave',
    tableName: 'annual_leaves',
    timestamps: true,
    hooks: {
      // Auto-calculate days whenever firstLeave or secondLeave changes
      beforeCreate(record) {
        record.firstLeaveDays = calcLeaveDays(record.firstLeave);
        record.secondLeaveDays = calcLeaveDays(record.secondLeave);
      },
      beforeUpdate(record) {
        if (record.changed('firstLeave')) {
          record.firstLeaveDays = calcLeaveDays(record.firstLeave);
        }
        if (record.changed('secondLeave')) {
          record.secondLeaveDays = calcLeaveDays(record.secondLeave);
        }
      },
    },
  }
);

module.exports = AnnualLeave;
