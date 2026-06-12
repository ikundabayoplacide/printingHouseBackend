'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hobes', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      hobe_no: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      name_of_hobe: { type: Sequelize.STRING(255), allowNull: false },
      done_at: { type: Sequelize.DATE, allowNull: false },
      expired_at: { type: Sequelize.DATE, allowNull: true },
      qty: { type: Sequelize.INTEGER, allowNull: false },
      price_per_item: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      total_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      qty_sold: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      qty_remains: { type: Sequelize.INTEGER, allowNull: false },
      ob: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.ENUM('active', 'closed', 'expired'), allowNull: false, defaultValue: 'active' },
      note: { type: Sequelize.TEXT, allowNull: true },
      created_by_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('hobes');
  },
};
