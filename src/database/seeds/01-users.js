'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Must match fixed IDs in 04-departments.js
const DEPT_IDS = {
  printing:    'aaaaaaaa-0001-4000-a000-000000000001',
  binding:     'aaaaaaaa-0001-4000-a000-000000000002',
  composition: 'aaaaaaaa-0001-4000-a000-000000000003',
  sales:       'aaaaaaaa-0001-4000-a000-000000000004',
  finance:     'aaaaaaaa-0001-4000-a000-000000000005',
  admin:       'aaaaaaaa-0001-4000-a000-000000000006',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash('password123', 12);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@gmail.com',
        password,
        phone: '+250788000001',
        gender: 'MALE',
        role: 'ADMIN',
        departmentId: DEPT_IDS.admin,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Receptionist',
        email: 'receptionist@gmail.com',
        password,
        phone: '+250788000002',
        gender: 'FEMALE',
        role: 'RECEPTIONIST',
        departmentId: DEPT_IDS.admin,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Sales',
        email: 'sales@gmail.com',
        password,
        phone: '+250788000003',
        gender: 'MALE',
        role: 'SALES',
        departmentId: DEPT_IDS.sales,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'DAF Director',
        email: 'daf@gmail.com',
        password,
        phone: '+250788000004',
        gender: 'MALE',
        role: 'DAF',
        departmentId: DEPT_IDS.finance,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Accountant',
        email: 'accountant@gmail.com',
        password,
        phone: '+250788000005',
        gender: 'FEMALE',
        role: 'ACCOUNTANT',
        departmentId: DEPT_IDS.finance,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Production Manager',
        email: 'production@gmail.com',
        password,
        phone: '+250788000006',
        gender: 'MALE',
        role: 'PRODUCTION_MANAGER',
        departmentId: DEPT_IDS.printing,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Stock Keeper',
        email: 'stock@gmail.com',
        password,
        phone: '+250788000007',
        gender: 'MALE',
        role: 'STOCK',
        departmentId: DEPT_IDS.printing,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Supervisor',
        email: 'supervisor@gmail.com',
        password,
        phone: '+250788000008',
        gender: 'MALE',
        role: 'SUPERVISOR',
        departmentId: DEPT_IDS.printing,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Worker',
        email: 'worker@gmail.com',
        password,
        phone: '+250788000009',
        gender: 'MALE',
        role: 'WORKER',
        departmentId: DEPT_IDS.printing,
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
          'admin@gmail.com',
          'receptionist@gmail.com',
          'sales@gmail.com',
          'daf@gmail.com',
          'accountant@gmail.com',
          'production@gmail.com',
          'stock@gmail.com',
          'supervisor@gmail.com',
          'worker@gmail.com',
        ],
      },
    });
  },
};
