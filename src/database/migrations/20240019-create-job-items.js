'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      jobId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'jobs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      stockItemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'stock_items', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      quantityNeeded: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      quantityUsed: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: null,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addIndex('job_items', ['jobId']);
    await queryInterface.addIndex('job_items', ['stockItemId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('job_items');
  },
};
