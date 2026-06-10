'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_customers_type" ADD VALUE IF NOT EXISTS 'HOBE';
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE customers ALTER COLUMN type TYPE VARCHAR(50);
    `);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_customers_type";`);
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_customers_type" AS ENUM ('BUSINESS', 'VISITOR', 'BOUTIQUE');
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE customers ALTER COLUMN type TYPE "enum_customers_type" USING type::"enum_customers_type";
    `);
  },
};
