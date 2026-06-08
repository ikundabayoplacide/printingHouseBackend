'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'estimatedTime', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      comment: 'e.g. "2h 30m"',
    });
    await queryInterface.addColumn('jobs', 'startedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('jobs', 'pausedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('jobs', 'completedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('jobs', 'estimatedTime');
    await queryInterface.removeColumn('jobs', 'startedAt');
    await queryInterface.removeColumn('jobs', 'pausedAt');
    await queryInterface.removeColumn('jobs', 'completedAt');
  },
};
