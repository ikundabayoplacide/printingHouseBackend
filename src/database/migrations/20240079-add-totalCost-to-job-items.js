'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('job_items', 'totalCost', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('job_items', 'totalCost');
  },
};
