'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('reports', 'attachment_url', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('reports', 'attachment_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
