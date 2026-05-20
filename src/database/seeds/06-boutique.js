'use strict';

const { v4: uuidv4 } = require('uuid');

// Fixed UUIDs for categories so products can reference them
const categoryIds = {
  printing:     'b1000001-0000-4000-a000-000000000001',
  binding:      'b1000002-0000-4000-a000-000000000002',
  packaging:    'b1000003-0000-4000-a000-000000000003',
  stationery:   'b1000004-0000-4000-a000-000000000004',
  signage:      'b1000005-0000-4000-a000-000000000005',
  promotional:  'b1000006-0000-4000-a000-000000000006',
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // ── Categories ────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('boutique_categories', [
      { id: categoryIds.printing,    name: 'Printing',    skuPrefix: 'PRN', colorClass: 'bg-blue-100 text-blue-800',   isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: categoryIds.binding,     name: 'Binding',     skuPrefix: 'BND', colorClass: 'bg-green-100 text-green-800', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: categoryIds.packaging,   name: 'Packaging',   skuPrefix: 'PKG', colorClass: 'bg-yellow-100 text-yellow-800', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: categoryIds.stationery,  name: 'Stationery',  skuPrefix: 'STA', colorClass: 'bg-purple-100 text-purple-800', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: categoryIds.signage,     name: 'Signage',     skuPrefix: 'SGN', colorClass: 'bg-red-100 text-red-800',     isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: categoryIds.promotional, name: 'Promotional', skuPrefix: 'PRO', colorClass: 'bg-orange-100 text-orange-800', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // ── Products ──────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('boutique_products', [
      // Printing
      { id: uuidv4(), sku: 'PRN-001', name: 'Business Cards', description: 'Standard 85x55mm full colour double-sided business cards.', categoryId: categoryIds.printing, unit: 'per 100', price: 5000, stock: 200, minStock: 20, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'PRN-002', name: 'A4 Flyers', description: 'Full colour A4 flyers on 130gsm gloss paper.', categoryId: categoryIds.printing, unit: 'per 100', price: 8000, stock: 500, minStock: 50, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'PRN-003', name: 'A3 Posters', description: 'High-resolution A3 posters on 200gsm matt paper.', categoryId: categoryIds.printing, unit: 'per 50', price: 12000, stock: 150, minStock: 15, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'PRN-004', name: 'Letterhead', description: 'A4 branded letterhead on 100gsm paper.', categoryId: categoryIds.printing, unit: 'per 100', price: 6000, stock: 300, minStock: 30, isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // Binding
      { id: uuidv4(), sku: 'BND-001', name: 'Spiral Binding', description: 'Spiral binding for documents up to 100 pages.', categoryId: categoryIds.binding, unit: 'per item', price: 1500, stock: 100, minStock: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'BND-002', name: 'Perfect Binding', description: 'Perfect binding for books and thick documents.', categoryId: categoryIds.binding, unit: 'per item', price: 3000, stock: 80, minStock: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'BND-003', name: 'Saddle Stitch', description: 'Saddle stitch binding for booklets and magazines.', categoryId: categoryIds.binding, unit: 'per item', price: 1000, stock: 5, minStock: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // Packaging
      { id: uuidv4(), sku: 'PKG-001', name: 'Branded Boxes', description: 'Custom printed cardboard boxes.', categoryId: categoryIds.packaging, unit: 'per item', price: 2500, stock: 60, minStock: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'PKG-002', name: 'Branded Envelopes', description: 'DL envelopes with custom logo print.', categoryId: categoryIds.packaging, unit: 'per 100', price: 4000, stock: 0, minStock: 20, isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // Stationery
      { id: uuidv4(), sku: 'STA-001', name: 'Notebooks', description: 'A5 branded notebooks, 80 pages.', categoryId: categoryIds.stationery, unit: 'per item', price: 3500, stock: 120, minStock: 15, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'STA-002', name: 'Notepads', description: 'A4 branded notepads, 50 sheets.', categoryId: categoryIds.stationery, unit: 'per pad', price: 2000, stock: 8, minStock: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'STA-003', name: 'Pens', description: 'Branded ballpoint pens.', categoryId: categoryIds.stationery, unit: 'per item', price: 500, stock: 200, minStock: 30, isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // Signage
      { id: uuidv4(), sku: 'SGN-001', name: 'Roll-Up Banner', description: '85x200cm roll-up banner with aluminium stand.', categoryId: categoryIds.signage, unit: 'per item', price: 35000, stock: 15, minStock: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'SGN-002', name: 'Vinyl Banner', description: 'Outdoor vinyl banner, custom size.', categoryId: categoryIds.signage, unit: 'per sqm', price: 8000, stock: 40, minStock: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // Promotional
      { id: uuidv4(), sku: 'PRO-001', name: 'Branded T-Shirts', description: 'Cotton t-shirts with custom logo print.', categoryId: categoryIds.promotional, unit: 'per item', price: 7000, stock: 50, minStock: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), sku: 'PRO-002', name: 'Branded Caps', description: 'Adjustable caps with embroidered logo.', categoryId: categoryIds.promotional, unit: 'per item', price: 5000, stock: 30, minStock: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('boutique_products', {
      sku: {
        [require('sequelize').Op.in]: [
          'PRN-001', 'PRN-002', 'PRN-003', 'PRN-004',
          'BND-001', 'BND-002', 'BND-003',
          'PKG-001', 'PKG-002',
          'STA-001', 'STA-002', 'STA-003',
          'SGN-001', 'SGN-002',
          'PRO-001', 'PRO-002',
        ],
      },
    });

    await queryInterface.bulkDelete('boutique_categories', {
      skuPrefix: {
        [require('sequelize').Op.in]: ['PRN', 'BND', 'PKG', 'STA', 'SGN', 'PRO'],
      },
    });
  },
};
