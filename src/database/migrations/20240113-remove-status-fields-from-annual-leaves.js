'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('annual_leaves', 'status');
    await queryInterface.removeColumn('annual_leaves', 'viewedAt');
    await queryInterface.removeColumn('annual_leaves', 'approvedAt');
    await queryInterface.removeColumn('annual_leaves', 'rejectedAt');
    await queryInterface.removeColumn('annual_leaves', 'approvedById');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('annual_leaves', 'status', {
      type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED', 'VIEWED'),
      allowNull: false,
      defaultValue: 'PENDING',
    });
    await queryInterface.addColumn('annual_leaves', 'viewedAt', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('annual_leaves', 'approvedAt', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('annual_leaves', 'rejectedAt', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('annual_leaves', 'approvedById', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};
