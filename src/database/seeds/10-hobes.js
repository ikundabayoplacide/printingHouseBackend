'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Get admin user id
    const [admin] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!admin) throw new Error('No ADMIN user found. Run users seed first.');

    const createdById = admin.id;

    const hobes = [
      {
        id: uuidv4(),
        hobe_no: 'HB-20250101-0001',
        name_of_hobe: 'Batch Janvier 2025',
        done_at: new Date('2025-01-10'),
        expired_at: new Date('2025-07-10'),
        qty: 500,
        price_per_item: 1200,
        total_price: 600000,
        qty_sold: 120,
        qty_remains: 380,
        ob: 0,
        status: 'active',
        note: 'First production batch of the year',
        created_by_id: createdById,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        hobe_no: 'HB-20250201-0002',
        name_of_hobe: 'Batch Février 2025',
        done_at: new Date('2025-02-05'),
        expired_at: new Date('2025-08-05'),
        qty: 300,
        price_per_item: 1500,
        total_price: 450000,
        qty_sold: 300,
        qty_remains: 0,
        ob: 0,
        status: 'closed',
        note: 'Fully sold out',
        created_by_id: createdById,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        hobe_no: 'HB-20250301-0003',
        name_of_hobe: 'Batch Mars 2025',
        done_at: new Date('2025-03-01'),
        expired_at: new Date('2025-09-01'),
        qty: 800,
        price_per_item: 1000,
        total_price: 800000,
        qty_sold: 0,
        qty_remains: 800,
        ob: 50000,
        status: 'active',
        note: 'New batch with opening balance carried forward',
        created_by_id: createdById,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        hobe_no: 'HB-20241201-0004',
        name_of_hobe: 'Batch Décembre 2024',
        done_at: new Date('2024-12-01'),
        expired_at: new Date('2025-03-01'),
        qty: 200,
        price_per_item: 2000,
        total_price: 400000,
        qty_sold: 180,
        qty_remains: 20,
        ob: 0,
        status: 'expired',
        note: 'Batch expired with 20 items remaining',
        created_by_id: createdById,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('hobes', hobes);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('hobes', {
      hobe_no: {
        [require('sequelize').Op.in]: [
          'HB-20250101-0001',
          'HB-20250201-0002',
          'HB-20250301-0003',
          'HB-20241201-0004',
        ],
      },
    });
  },
};
