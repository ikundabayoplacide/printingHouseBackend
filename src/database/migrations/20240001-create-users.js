'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      departmentId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM(
          'ADMIN',
          'RECEPTIONIST',
          'SALES',
          'DAF',
          'ACCOUNTANT',
          'PRODUCTION_MANAGER',
          'STOCK',
          'SUPERVISOR',
          'WORKER'
        ),
        defaultValue: 'WORKER',
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('users', ['email'], { unique: true });
    await queryInterface.addIndex('users', ['role']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  },
};
