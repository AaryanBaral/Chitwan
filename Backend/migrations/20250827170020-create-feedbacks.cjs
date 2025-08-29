"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("feedbacks", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      full_name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.STRING(191),
        allowNull: true,
      },
      phone: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: true,
      },
      subject: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: true,
      },
      message: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: Sequelize.DataTypes.INTEGER, // 1..5
        allowNull: true,
      },
      status: {
        type: Sequelize.DataTypes.ENUM("new", "reviewed", "resolved", "archived"),
        allowNull: false,
        defaultValue: "new",
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
    await queryInterface.addIndex("feedbacks", ["status"], { name: "ix_feedbacks_status" });
    await queryInterface.addIndex("feedbacks", ["created_at"], { name: "ix_feedbacks_created_at" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("feedbacks", "ix_feedbacks_status").catch(() => {});
    await queryInterface.removeIndex("feedbacks", "ix_feedbacks_created_at").catch(() => {});
    await queryInterface.dropTable("feedbacks");
  },
};

