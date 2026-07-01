'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      { id: uuidv4(), name: 'ADMIN', description: 'Full access to everything. Manages the system itself.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'RECEPTIONIST', description: 'Front desk role — registers visitors, collects payments, handles deliveries.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'SALES', description: 'Manages client relationships, quotations, invoices, and job creation.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'DAF', description: 'Finance Director — oversight and approval authority.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'ACCOUNTANT', description: 'Handles day-to-day financial operations.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'PRODUCTION_MANAGER', description: 'Plans and oversees production workflow.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'STOCK', description: 'Manages inventory, suppliers, and material requests.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'SUPERVISOR', description: 'Oversees a specific department\'s workers and production quality.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'WORKER', description: 'Lowest privilege. Only sees and manages their own work.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'HOBE', description: 'Manages hobe production batches and trades.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'CASHIER', description: 'Handles cash transactions, payments, and receipts.', isActive: true, isSystem: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', {
      name: {
        [require('sequelize').Op.in]: [
          'ADMIN', 'RECEPTIONIST', 'SALES', 'DAF', 'ACCOUNTANT',
          'PRODUCTION_MANAGER', 'STOCK', 'SUPERVISOR', 'WORKER', 'CASHIER',
        ],
      },
    });
  },
};
