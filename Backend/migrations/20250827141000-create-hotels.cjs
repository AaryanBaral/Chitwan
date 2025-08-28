"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hotels", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      address: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true,
      },
      zip: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: true,
      },
      contact_name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true,
      },
      contact_email: {
        type: Sequelize.DataTypes.STRING(191),
        allowNull: true,
        validate: { isEmail: true },
      },
      contact_phone: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: true,
      },
      images: {
        type: Sequelize.DataTypes.TEXT,
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

    await queryInterface.addIndex("hotels", ["name"], { name: "ix_hotels_name" });
    await queryInterface.addIndex("hotels", ["city"], { name: "ix_hotels_city" });
    await queryInterface.addIndex("hotels", ["status"], { name: "ix_hotels_status" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("hotels", "ix_hotels_name").catch(() => {});
    await queryInterface.removeIndex("hotels", "ix_hotels_city").catch(() => {});
    await queryInterface.removeIndex("hotels", "ix_hotels_status").catch(() => {});
    await queryInterface.dropTable("hotels");
  },
};

