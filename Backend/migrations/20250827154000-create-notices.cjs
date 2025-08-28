"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notices", {
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
      summary: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: true,
      },
      body: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.DataTypes.ENUM("draft", "published", "archived"),
        allowNull: false,
        defaultValue: "draft",
      },
      is_popup: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      display_from: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      display_to: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      priority: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      link_url: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: true,
      },
      attachment: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },
      tags: {
        type: Sequelize.DataTypes.STRING(300),
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

    await queryInterface.addIndex("notices", ["status"], { name: "ix_notices_status" });
    await queryInterface.addIndex("notices", ["is_popup"], { name: "ix_notices_is_popup" });
    await queryInterface.addIndex("notices", ["display_from", "display_to"], { name: "ix_notices_window" });
    await queryInterface.addIndex("notices", ["priority"], { name: "ix_notices_priority" });
    await queryInterface.addIndex("notices", ["created_at"], { name: "ix_notices_created" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("notices", "ix_notices_status").catch(() => {});
    await queryInterface.removeIndex("notices", "ix_notices_is_popup").catch(() => {});
    await queryInterface.removeIndex("notices", "ix_notices_window").catch(() => {});
    await queryInterface.removeIndex("notices", "ix_notices_priority").catch(() => {});
    await queryInterface.removeIndex("notices", "ix_notices_created").catch(() => {});
    await queryInterface.dropTable("notices");
  },
};

