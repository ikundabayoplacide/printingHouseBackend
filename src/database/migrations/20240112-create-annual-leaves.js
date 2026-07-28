'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('annual_leaves', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fullNames: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      firstLeave: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'First leave period (e.g., "12/07/2026 - 31/07/2026")',
      },
      secondLeave: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Second leave period (e.g., "01/11/2026 - 10/11/2026")',
      },
      firstLeaveDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Calculated days for first leave period',
      },
      secondLeaveDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Calculated days for second leave period',
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      docs: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        comment: 'Uploaded document (base64 or URL)',
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED', 'VIEWED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      viewedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approvedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rejectedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      editedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Admin notes or rejection reason',
      },
      createdById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      approvedById: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('annual_leaves', ['fullNames']);
    await queryInterface.addIndex('annual_leaves', ['status']);
    await queryInterface.addIndex('annual_leaves', ['createdById']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('annual_leaves');
  },
};
