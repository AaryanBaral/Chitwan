"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admins", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        // MySQL default UUID (so inserts work even if app doesn't send id)
        defaultValue: Sequelize.literal("(UUID())"),
      },
      email: {
        type: Sequelize.DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      is_super_admin: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      last_login_at: {
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

  },

  async down(queryInterface) {
    await queryInterface.dropTable("admins");
  },
};
