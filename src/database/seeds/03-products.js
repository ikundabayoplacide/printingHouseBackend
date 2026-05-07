'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('products', [
      {
        id: uuidv4(),
        name: 'Business Cards',
        description: 'Standard 85x55mm business cards, full colour double-sided.',
        category: 'Cards',
        basePrice: 15.00,
        unit: '100 pcs',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'A4 Flyers',
        description: 'Full colour A4 flyers on 130gsm gloss paper.',
        category: 'Flyers',
        basePrice: 25.00,
        unit: '100 pcs',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'A3 Posters',
        description: 'High-resolution A3 posters on 200gsm matt paper.',
        category: 'Posters',
        basePrice: 40.00,
        unit: '50 pcs',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Branded Envelopes',
        description: 'DL envelopes with custom logo print.',
        category: 'Stationery',
        basePrice: 20.00,
        unit: '100 pcs',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Roll-Up Banner',
        description: '85x200cm roll-up banner with aluminium stand.',
        category: 'Banners',
        basePrice: 55.00,
        unit: 'piece',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Letterhead',
        description: 'A4 branded letterhead on 100gsm paper.',
        category: 'Stationery',
        basePrice: 18.00,
        unit: '100 pcs',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', {
      name: {
        [require('sequelize').Op.in]: [
          'Business Cards',
          'A4 Flyers',
          'A3 Posters',
          'Branded Envelopes',
          'Roll-Up Banner',
          'Letterhead',
        ],
      },
    });
  },
};
