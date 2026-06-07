'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('employees', 'jobId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: { model: 'jobs', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('employees', ['jobId']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('employees', ['jobId']);
    await queryInterface.removeColumn('employees', 'jobId');
  },
};
