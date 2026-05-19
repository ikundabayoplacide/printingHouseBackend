'use strict';

/** @type {import('sequelize-cli').Migration} */

// Fixed UUIDs so users seed can reference them
const DEPT_IDS = {
  printing:    'aaaaaaaa-0001-4000-a000-000000000001',
  binding:     'aaaaaaaa-0001-4000-a000-000000000002',
  composition: 'aaaaaaaa-0001-4000-a000-000000000003',
  sales:       'aaaaaaaa-0001-4000-a000-000000000004',
  finance:     'aaaaaaaa-0001-4000-a000-000000000005',
  admin:       'aaaaaaaa-0001-4000-a000-000000000006',
};

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('departments', [
      {
        id: DEPT_IDS.printing,
        name: 'Printing',
        description: 'Handles all printing operations and press work.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: DEPT_IDS.binding,
        name: 'Binding',
        description: 'Responsible for binding, finishing, and packaging of printed materials.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: DEPT_IDS.composition,
        name: 'Composition',
        description: 'Handles pre-press composition, layout, and design preparation.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: DEPT_IDS.sales,
        name: 'Sales',
        description: 'Manages customer relations and sales operations.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: DEPT_IDS.finance,
        name: 'Finance',
        description: 'Handles accounting, budgeting, and financial reporting.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: DEPT_IDS.admin,
        name: 'Administration',
        description: 'Manages administrative operations and HR.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('departments', {
      name: {
        [require('sequelize').Op.in]: [
          'Printing', 'Binding', 'Composition', 'Sales', 'Finance', 'Administration',
        ],
      },
    });
  },
};

module.exports.DEPT_IDS = DEPT_IDS;
