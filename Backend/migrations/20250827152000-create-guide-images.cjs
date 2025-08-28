"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("guide_images", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      guide_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: { model: "guides", key: "id" },
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

    // Enforce one image per guide
    await queryInterface.addConstraint("guide_images", {
      fields: ["guide_id"],
      type: "unique",
      name: "uq_guide_images_guide_id",
    });
    await queryInterface.addIndex("guide_images", ["guide_id"], { name: "ix_guide_images_parent" });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint("guide_images", "uq_guide_images_guide_id").catch(() => {});
    await queryInterface.dropTable("guide_images");
  },
};

