"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("place_categories", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      slug: {
        type: Sequelize.DataTypes.STRING(180),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("place_categories", ["name"], { name: "ix_place_categories_name" });
    await queryInterface.addIndex("place_categories", ["slug"], { name: "ux_place_categories_slug", unique: true });
    await queryInterface.addIndex("place_categories", ["status"], { name: "ix_place_categories_status" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("place_categories", "ix_place_categories_name").catch(() => {});
    await queryInterface.removeIndex("place_categories", "ux_place_categories_slug").catch(() => {});
    await queryInterface.removeIndex("place_categories", "ix_place_categories_status").catch(() => {});
    await queryInterface.dropTable("place_categories");
  },
};
