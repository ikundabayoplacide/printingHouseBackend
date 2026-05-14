'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash('password123', 12);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@printinghouse.com',
        password,
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Supervisor',
        email: 'supervisor@printinghouse.com',
        password,
        role: 'SUPERVISOR',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Sales Manager',
        email: 'sales@printinghouse.com',
        password,
        role: 'SALESMANAGER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Receptionist',
        email: 'reception@printinghouse.com',
        password,
        role: 'RECEPTIONIST',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'DAF Director',
        email: 'daf@printinghouse.com',
        password,
        role: 'DAF',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Accountant',
        email: 'accountant@printinghouse.com',
        password,
        role: 'ACCOUNTANT',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Store Keeper',
        email: 'store@printinghouse.com',
        password,
        role: 'STOREKEEPER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Print Employee',
        email: 'print@printinghouse.com',
        password,
        role: 'PRINTEMPLOYEE',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: {
        [require('sequelize').Op.in]: [
          'admin@printinghouse.com',
          'supervisor@printinghouse.com',
          'sales@printinghouse.com',
          'reception@printinghouse.com',
          'daf@printinghouse.com',
          'accountant@printinghouse.com',
          'store@printinghouse.com',
          'print@printinghouse.com',
        ],
      },
    });
  },
};
