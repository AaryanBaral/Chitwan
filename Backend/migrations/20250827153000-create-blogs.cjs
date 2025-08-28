"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blogs", {
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
      slug: {
        type: Sequelize.DataTypes.STRING(220),
        allowNull: false,
        unique: true,
      },
      summary: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: true,
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
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

    await queryInterface.addIndex("blogs", ["slug"], { name: "uq_blogs_slug", unique: true });
    await queryInterface.addIndex("blogs", ["status"], { name: "ix_blogs_status" });
    await queryInterface.addIndex("blogs", ["created_at"], { name: "ix_blogs_created" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("blogs", "uq_blogs_slug").catch(() => {});
    await queryInterface.removeIndex("blogs", "ix_blogs_status").catch(() => {});
    await queryInterface.removeIndex("blogs", "ix_blogs_created").catch(() => {});
    await queryInterface.dropTable("blogs");
  },
};
