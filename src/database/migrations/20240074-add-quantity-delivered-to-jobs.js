'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'quantityDelivered', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Cumulative quantity already delivered to the customer',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('jobs', 'quantityDelivered');
  },
};
