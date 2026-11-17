'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('job_items');
    const hasOldName = Object.prototype.hasOwnProperty.call(columns, 'customName');
    const hasNewName = Object.prototype.hasOwnProperty.call(columns, 'itemName');

    if (hasOldName && hasNewName) {
      await queryInterface.sequelize.query(
        `UPDATE job_items SET "itemName" = "customName" WHERE "itemName" IS NULL;`
      );
      await queryInterface.removeColumn('job_items', 'customName');
    } else if (hasOldName) {
      await queryInterface.renameColumn('job_items', 'customName', 'itemName');
    } else if (!hasNewName) {
      await queryInterface.addColumn('job_items', 'itemName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const columns = await queryInterface.describeTable('job_items');
    const hasOldName = Object.prototype.hasOwnProperty.call(columns, 'customName');
    const hasNewName = Object.prototype.hasOwnProperty.call(columns, 'itemName');

    if (hasOldName && hasNewName) {
      await queryInterface.sequelize.query(
        `UPDATE job_items SET "customName" = "itemName" WHERE "customName" IS NULL;`
      );
      await queryInterface.removeColumn('job_items', 'itemName');
    } else if (hasNewName) {
      await queryInterface.renameColumn('job_items', 'itemName', 'customName');
    }
  },
};
