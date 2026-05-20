'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      itemName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      unit: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      supplier: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      unitCost: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      currentStock: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      alarmStock: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 5,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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

    await queryInterface.addIndex('stock_items', ['category']);
    await queryInterface.addIndex('stock_items', ['isActive']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('stock_items');
  },
};
