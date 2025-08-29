"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("places", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"),
      },
      name: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: Sequelize.DataTypes.STRING(100),
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
      latitude: {
        type: Sequelize.DataTypes.DECIMAL(10, 6),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DataTypes.DECIMAL(10, 6),
        allowNull: true,
      },
      opening_hours: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },
      tags: {
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
    await queryInterface.addIndex("places", ["name"], { name: "ix_places_name" });
    await queryInterface.addIndex("places", ["category"], { name: "ix_places_category" });
    await queryInterface.addIndex("places", ["status"], { name: "ix_places_status" });
    await queryInterface.addIndex("places", ["city"], { name: "ix_places_city" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("places", "ix_places_name").catch(() => {});
    await queryInterface.removeIndex("places", "ix_places_category").catch(() => {});
    await queryInterface.removeIndex("places", "ix_places_status").catch(() => {});
    await queryInterface.removeIndex("places", "ix_places_city").catch(() => {});
    await queryInterface.dropTable("places");
  },
};

