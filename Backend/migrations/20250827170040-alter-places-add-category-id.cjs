"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add category_id
    await queryInterface.addColumn("places", "category_id", {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    });

    // Add FK constraint (SET NULL on delete)
    await queryInterface.addConstraint("places", {
      fields: ["category_id"],
      type: "foreign key",
      name: "fk_places_place_category_id",
      references: {
        table: "place_categories",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Drop old category string column if exists
    const table = await queryInterface.describeTable("places");
    if (table.category) {
      await queryInterface.removeColumn("places", "category");
    }
  },

  async down(queryInterface) {
    // Recreate old category column (nullable)
    await queryInterface.addColumn("places", "category", {
      type: require("sequelize").DataTypes.STRING(100),
      allowNull: true,
    }).catch(() => {});

    // Remove FK & column
    await queryInterface.removeConstraint("places", "fk_places_place_category_id").catch(() => {});
    await queryInterface.removeColumn("places", "category_id").catch(() => {});
  },
};
