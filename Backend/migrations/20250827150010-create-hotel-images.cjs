"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hotel_images", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      hotel_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: { model: "hotels", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
    await queryInterface.addIndex("hotel_images", ["hotel_id"], { name: "ix_hotel_images_parent" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("hotel_images");
  },
};

