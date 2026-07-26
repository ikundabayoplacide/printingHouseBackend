'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('general_stock_sorties', 'takenById', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('general_stock_sorties', 'takenAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('general_stock_sorties', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected', 'taken'),
      defaultValue: 'pending',
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('general_stock_sorties', 'takenById');
    await queryInterface.removeColumn('general_stock_sorties', 'takenAt');
    await queryInterface.changeColumn('general_stock_sorties', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false,
    });
  },
};
