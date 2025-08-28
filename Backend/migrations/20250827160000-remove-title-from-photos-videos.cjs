"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove title columns
    await queryInterface.removeColumn("photos", "title").catch(() => {});
    await queryInterface.removeColumn("videos", "title").catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    // Restore title columns
    await queryInterface.addColumn("photos", "title", {
      type: Sequelize.DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "",
      after: "id",
    }).catch(() => {});

    await queryInterface.addColumn("videos", "title", {
      type: Sequelize.DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "",
      after: "id",
    }).catch(() => {});
  },
};

