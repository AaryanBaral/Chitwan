"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("flora_fauna", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      type: {
        type: Sequelize.DataTypes.ENUM("flora", "fauna"),
        allowNull: false,
      },
      common_name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      scientific_name: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: true,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      habitat: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: true,
      },
      location: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: true,
      },
      conservation_status: {
        type: Sequelize.DataTypes.STRING(100),
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

    await queryInterface.addIndex("flora_fauna", ["type"], { name: "ix_flora_fauna_type" });
    await queryInterface.addIndex("flora_fauna", ["common_name"], { name: "ix_flora_fauna_common_name" });
    await queryInterface.addIndex("flora_fauna", ["status"], { name: "ix_flora_fauna_status" });

    await queryInterface.createTable("flora_fauna_images", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      flora_fauna_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: { model: "flora_fauna", key: "id" },
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
    await queryInterface.addIndex("flora_fauna_images", ["flora_fauna_id"], { name: "ix_ffa_images_parent" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("flora_fauna_images");
    await queryInterface.removeIndex("flora_fauna", "ix_flora_fauna_type").catch(() => {});
    await queryInterface.removeIndex("flora_fauna", "ix_flora_fauna_common_name").catch(() => {});
    await queryInterface.removeIndex("flora_fauna", "ix_flora_fauna_status").catch(() => {});
    await queryInterface.dropTable("flora_fauna");
  },
};

