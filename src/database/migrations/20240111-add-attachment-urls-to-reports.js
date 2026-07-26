'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reports', 'attachment_urls', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('reports', 'attachment_urls');
  },
};
