'use strict';

const { v4: uuidv4 } = require('uuid');
const { QueryTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Fetch the admin user to seed sample notifications
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@printinghouse.com' LIMIT 1`,
      { type: QueryTypes.SELECT }
    );

    if (!users.length) return;

    const adminId = users[0].id;

    await queryInterface.bulkInsert('notifications', [
      {
        id: uuidv4(),
        userId: adminId,
        title: 'Welcome to Printing House',
        message: 'Your system is set up and ready to use.',
        type: 'GENERAL',
        isRead: false,
        relatedEntityType: null,
        relatedEntityId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: adminId,
        title: 'System Ready',
        message: 'All departments and users have been seeded successfully.',
        type: 'GENERAL',
        isRead: false,
        relatedEntityType: null,
        relatedEntityId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('notifications', null, {});
  },
};
