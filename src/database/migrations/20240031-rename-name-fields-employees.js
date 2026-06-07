'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('employees', 'firstName');
    await queryInterface.removeColumn('employees', 'lastName');
    await queryInterface.addColumn('employees', 'fullName', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('employees', 'fullName');
    await queryInterface.addColumn('employees', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('employees', 'lastName', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
  },
};
