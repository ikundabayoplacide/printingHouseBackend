'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('employees', 'userId', {
      type: Sequelize.UUID,
      allowNull: true,
      unique: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Linked auth user account',
    });

    await queryInterface.addIndex('employees', ['userId']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('employees', ['userId']);
    await queryInterface.removeColumn('employees', 'userId');
  },
};
