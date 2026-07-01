'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('general_stock_items', 'amountPerUnit', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      after: 'unitCost',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('general_stock_items', 'amountPerUnit');
  },
};
