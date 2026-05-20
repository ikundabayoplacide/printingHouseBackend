'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('boutique_stock_movements', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'boutique_products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      changedById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      change: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Positive = restock, negative = sale/use',
      },
      reason: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      stockBefore: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      stockAfter: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addIndex('boutique_stock_movements', ['productId']);
    await queryInterface.addIndex('boutique_stock_movements', ['changedById']);
    await queryInterface.addIndex('boutique_stock_movements', ['createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('boutique_stock_movements');
  },
};
