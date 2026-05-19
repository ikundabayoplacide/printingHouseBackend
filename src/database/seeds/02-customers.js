'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('customers', [
      {
        id: uuidv4(),
        name: 'Alice Mutoni',
        email: 'alice@acmecorp.rw',
        phone: '+250788000001',
        company: 'Acme Corp',
        address: 'KG 123 St',
        notes: 'Preferred customer, bulk orders.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Bob Nkurunziza',
        email: 'bob@techprint.rw',
        phone: '+250788000002',
        company: 'TechPrint Ltd',
        address: 'KN 45 Ave',
        notes: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Claire Uwase',
        email: 'claire@designstudio.rw',
        phone: '+250788000003',
        company: 'Design Studio',
        address: 'KK 7 Rd',
        notes: 'Requires invoice on delivery.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'David Habimana',
        email: 'david@freelance.rw',
        phone: '+250788000004',
        company: null,
        address: 'Remera',
        notes: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('customers', {
      email: {
        [require('sequelize').Op.in]: [
          'alice@acmecorp.rw',
          'bob@techprint.rw',
          'claire@designstudio.rw',
          'david@freelance.rw',
        ],
      },
    });
  },
};
