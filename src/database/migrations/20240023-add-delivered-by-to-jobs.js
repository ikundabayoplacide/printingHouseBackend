'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('jobs');

    if (!tableDesc.deliveredByName) {
      await queryInterface.addColumn('jobs', 'deliveredByName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableDesc.deliveredByContact) {
      await queryInterface.addColumn('jobs', 'deliveredByContact', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('jobs', 'deliveredByName');
    await queryInterface.removeColumn('jobs', 'deliveredByContact');
  },
};
