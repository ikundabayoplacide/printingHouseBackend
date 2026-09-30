"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("jobs", "isThesisJob", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment:
        "Indicates if this is a Print & Binding of Thesis job created by receptionist",
    });

    await queryInterface.addColumn("jobs", "thesisOwner", {
      type: Sequelize.JSON,
      allowNull: true,
      comment:
        "Thesis owner information: {fullName, phone, email, description}",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("jobs", "thesisOwner");
    await queryInterface.removeColumn("jobs", "isThesisJob");
  },
};
