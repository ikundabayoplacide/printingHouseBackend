'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const items = [
      // Paper
      { id: uuidv4(), itemName: 'A4 Paper (80gsm)', category: 'Paper', unit: 'reams', description: 'Standard A4 white paper, 500 sheets per ream.', supplier: 'PaperWorld Ltd', unitCost: 3500, currentStock: 120, alarmStock: 20, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), itemName: 'A3 Paper (100gsm)', category: 'Paper', unit: 'reams', description: 'A3 heavy paper for posters and large prints.', supplier: 'PaperWorld Ltd', unitCost: 6000, currentStock: 60, alarmStock: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), itemName: 'Glossy Photo Paper (A4)', category: 'Paper', unit: 'packs', description: '20 sheets per pack, 200gsm glossy.', supplier: 'PrintSupply Co', unitCost: 8000, currentStock: 8, alarmStock: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), itemName: 'Cardstock (A4, 300gsm)', category: 'Paper', unit: 'packs', description: 'Thick cardstock for business cards and covers.', supplier: 'PaperWorld Ltd', unitCost: 12000, currentStock: 0, alarmStock: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // Ink & Toner
      { id: uuidv4(), itemName: 'Black Toner Cartridge', category: 'Ink & Toner', unit: 'pcs', description: 'Compatible black toner for laser printers.', supplier: 'InkPro Rwanda', unitCost: 45000, currentStock: 15, alarmStock: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), itemName: 'Cyan Ink Cartridge', category: 'Ink & Toner', unit: 'pcs', description: 'Cyan ink for inkjet printers.', supplier: 'InkPro Rwanda', unitCost: 25000, currentStock: 10, alarmStock: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), itemName: 'Magenta Ink Cartridge', category: 'Ink & Toner', unit: 'pcs', description: 'Magenta ink for inkjet printers.', supplier: 'InkPro Rwanda', unitCost: 25000, currentStock: 3, alarmStock: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), itemName: 'Yellow Ink Cartridge', category: 'Ink & Toner', unit: 'pcs', description: 'Yellow ink for inkjet printers.', supplier: 'InkPro Rwanda', unitCost: 25000, currentStock: 7, alarmStock: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // Binding Materials
      { id: uuidv4(), itemName: 'Spiral Binding Coils (A4)', category: 'Binding Materials', unit: 'pcs', description: 'Plastic spiral coils for A4 documents.', supplier: 'BindIt Supplies', unitCost: 500, currentStock: 200, alarmStock: 30, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), itemName: 'Binding Covers (Clear)', category: 'Binding Materials', unit: 'packs', description: 'Transparent front covers, 100 per pack.', supplier: 'BindIt Supplies', unitCost: 4000, currentStock: 25, alarmStock: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), itemName: 'Thermal Binding Glue', category: 'Binding Materials', unit: 'kg', description: 'Hot glue for perfect binding.', supplier: 'BindIt Supplies', unitCost: 15000, currentStock: 4, alarmStock: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // Packaging
      { id: uuidv4(), itemName: 'Cardboard Boxes (Small)', category: 'Packaging', unit: 'pcs', description: 'Small cardboard boxes for packaging printed materials.', supplier: 'PackRw Ltd', unitCost: 800, currentStock: 150, alarmStock: 20, isActive: true, createdAt: new Date(), updatedAt: new Date() },

      // Cleaning & Maintenance
      { id: uuidv4(), itemName: 'Isopropyl Alcohol (1L)', category: 'Maintenance', unit: 'bottles', description: 'For cleaning print heads and rollers.', supplier: 'TechCare Rwanda', unitCost: 6000, currentStock: 10, alarmStock: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('stock_items', items);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('stock_items', {
      itemName: {
        [require('sequelize').Op.in]: [
          'A4 Paper (80gsm)', 'A3 Paper (100gsm)', 'Glossy Photo Paper (A4)', 'Cardstock (A4, 300gsm)',
          'Black Toner Cartridge', 'Cyan Ink Cartridge', 'Magenta Ink Cartridge', 'Yellow Ink Cartridge',
          'Spiral Binding Coils (A4)', 'Binding Covers (Clear)', 'Thermal Binding Glue',
          'Cardboard Boxes (Small)', 'Stretch Wrap Film', 'Bubble Wrap',
          'Printer Cleaning Kit', 'Isopropyl Alcohol (1L)',
        ],
      },
    });
  },
};
