'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_entries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      stockItemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'stock_items', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      receivedById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      quantityIn: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      unitCost: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      totalCost: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      supplier: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      referenceNo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      entryDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      stockBefore: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      stockAfter: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex('stock_entries', ['stockItemId']);
    await queryInterface.addIndex('stock_entries', ['receivedById']);
    await queryInterface.addIndex('stock_entries', ['entryDate']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('stock_entries');
  },
};
