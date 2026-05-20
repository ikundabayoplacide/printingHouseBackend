'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('customers');

    if (!tableDesc.tin) {
      await queryInterface.addColumn('customers', 'tin', {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Tax Identification Number for company customers',
      });
    }

    // Also make email nullable if it isn't already
    await queryInterface.changeColumn('customers', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('customers', 'tin');

    await queryInterface.changeColumn('customers', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
};
