'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('customers');

    if (!tableDesc.companyType) {
      await queryInterface.addColumn('customers', 'companyType', {
        type: Sequelize.ENUM('private', 'public'),
        allowNull: true,
      });
    }

    if (!tableDesc.groupeSize) {
      await queryInterface.addColumn('customers', 'groupeSize', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('customers', 'companyType');
    await queryInterface.removeColumn('customers', 'groupeSize');
  },
};
