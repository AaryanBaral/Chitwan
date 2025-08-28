"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("videos", {
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
      video: {
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

    await queryInterface.addIndex("videos", ["status"], { name: "ix_videos_status" });
    await queryInterface.addIndex("videos", ["created_at"], { name: "ix_videos_created" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("videos", "ix_videos_status").catch(() => {});
    await queryInterface.removeIndex("videos", "ix_videos_created").catch(() => {});
    await queryInterface.dropTable("videos");
  },
};

