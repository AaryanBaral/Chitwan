"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("place_images", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      place_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      path: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      alt_text: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
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
    await queryInterface.addIndex("place_images", ["place_id"], { name: "ix_place_images_place_id" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("place_images", "ix_place_images_place_id").catch(() => {});
    await queryInterface.dropTable("place_images");
  },
};

