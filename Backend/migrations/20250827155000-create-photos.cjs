"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("photos", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      title: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      tags: {
        type: Sequelize.DataTypes.STRING(300),
        allowNull: true,
      },
      status: {
        type: Sequelize.DataTypes.ENUM("draft", "published", "archived"),
        allowNull: false,
        defaultValue: "draft",
      },
      published_at: {
        type: Sequelize.DataTypes.DATE,
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

    await queryInterface.addIndex("photos", ["status"], { name: "ix_photos_status" });
    await queryInterface.addIndex("photos", ["created_at"], { name: "ix_photos_created" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("photos", "ix_photos_status").catch(() => {});
    await queryInterface.removeIndex("photos", "ix_photos_created").catch(() => {});
    await queryInterface.dropTable("photos");
  },
};

