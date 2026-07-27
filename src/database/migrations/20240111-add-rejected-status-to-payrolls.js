'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('payrolls', 'status', {
      type: Sequelize.ENUM('draft', 'approved', 'paid', 'rejected'),
      allowNull: false,
      defaultValue: 'draft',
    });

    await queryInterface.addColumn('payrolls', 'rejectionComment', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'notes',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('payrolls', 'rejectionComment');
    await queryInterface.changeColumn('payrolls', 'status', {
      type: Sequelize.ENUM('draft', 'approved', 'paid'),
      allowNull: false,
      defaultValue: 'draft',
    });
  },
};
