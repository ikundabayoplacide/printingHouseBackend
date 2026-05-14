'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('departments', [
      {
        id: uuidv4(),
        name: 'Printing',
        description: 'Handles all printing operations and press work.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Binding',
        description: 'Responsible for binding, finishing, and packaging of printed materials.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Composition',
        description: 'Handles pre-press composition, layout, and design preparation.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('departments', {
      name: {
        [require('sequelize').Op.in]: ['Printing', 'Binding', 'Composition'],
      },
    });
  },
};
