'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('job_items', 'stockItemId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'stock_items', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('job_items', 'customName', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'stockItemId',
    });

    await queryInterface.addColumn('job_items', 'unit', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('job_items', 'unitCost', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('job_items', 'unitCost');
    await queryInterface.removeColumn('job_items', 'unit');
    await queryInterface.removeColumn('job_items', 'customName');

    await queryInterface.changeColumn('job_items', 'stockItemId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'stock_items', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },
};
