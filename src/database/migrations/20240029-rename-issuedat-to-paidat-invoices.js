'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('invoices', 'issuedAt', 'paidAt');
    await queryInterface.sequelize.query(`ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'paid';`);
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('invoices', 'paidAt', 'issuedAt');
    await queryInterface.sequelize.query(`ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'draft';`);
  },
};
