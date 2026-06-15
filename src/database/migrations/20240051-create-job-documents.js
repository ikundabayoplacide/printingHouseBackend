'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job_documents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      jobId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'jobs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      uploadedById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      fileName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mimeType: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      fileUrl: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Base64 encoded file content with data URI prefix',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('job_documents', ['jobId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('job_documents');
  },
};
