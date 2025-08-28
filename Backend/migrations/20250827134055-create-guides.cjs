"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("guides", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("(UUID())"), // MySQL 8 UUID
      },

      full_name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      gender: {
        type: Sequelize.DataTypes.ENUM("male", "female", "other"),
        allowNull: true,
      },
      dob: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: true,
      },

      citizenship_no: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      license_no: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      phone: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.STRING(191),
        allowNull: true,
        unique: true,
      },
      address: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },

      // store as comma-separated text (or switch to JSON if you prefer)
      languages: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      specialization: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true,
      },
      experience_years: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },

      status: {
        type: Sequelize.DataTypes.ENUM("active", "suspended", "retired"),
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

    // Helpful indexes (unique ones are created automatically above)
    await queryInterface.addIndex("guides", ["full_name"], { name: "ix_guides_full_name" });
    await queryInterface.addIndex("guides", ["status"], { name: "ix_guides_status" });
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes first (safe even if they don't exist)
    await queryInterface.removeIndex("guides", "ix_guides_full_name").catch(() => {});
    await queryInterface.removeIndex("guides", "ix_guides_status").catch(() => {});
    // Drop ENUMs and table
    await queryInterface.dropTable("guides");
  },
};
