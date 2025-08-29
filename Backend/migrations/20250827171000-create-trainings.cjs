"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("trainings", {
      id: { type: Sequelize.DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: Sequelize.literal("(UUID())") },
      title: { type: Sequelize.DataTypes.STRING(200), allowNull: false },
      slug: { type: Sequelize.DataTypes.STRING(220), allowNull: false, unique: true },
      summary: { type: Sequelize.DataTypes.STRING(500), allowNull: true },
      description: { type: Sequelize.DataTypes.TEXT, allowNull: true },

      mode: { type: Sequelize.DataTypes.ENUM("in_person", "online", "hybrid"), allowNull: false, defaultValue: "in_person" },
      location: { type: Sequelize.DataTypes.STRING(255), allowNull: true },
      department: { type: Sequelize.DataTypes.STRING(150), allowNull: true },
      category: { type: Sequelize.DataTypes.STRING(100), allowNull: true },

      start_at: { type: Sequelize.DataTypes.DATE, allowNull: false },
      end_at: { type: Sequelize.DataTypes.DATE, allowNull: false },
      application_open_at: { type: Sequelize.DataTypes.DATE, allowNull: true },
      application_close_at: { type: Sequelize.DataTypes.DATE, allowNull: true },

      max_capacity: { type: Sequelize.DataTypes.INTEGER.UNSIGNED, allowNull: true },
      status: { type: Sequelize.DataTypes.ENUM("draft", "published", "closed", "cancelled"), allowNull: false, defaultValue: "draft" },

      eligibility: { type: Sequelize.DataTypes.STRING(255), allowNull: true },
      notes: { type: Sequelize.DataTypes.TEXT, allowNull: true },

      created_at: { type: Sequelize.DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") },
    });

    await queryInterface.addIndex("trainings", ["status"], { name: "ix_trainings_status" });
    await queryInterface.addIndex("trainings", ["application_open_at", "application_close_at"], { name: "ix_trainings_app_window" });
    await queryInterface.addIndex("trainings", ["start_at"], { name: "ix_trainings_start" });
    // FULLTEXT index (MySQL only); ignore if dialect doesn't support
    try {
      await queryInterface.addIndex("trainings", { fields: ["title", "summary", "description"], type: "FULLTEXT", name: "ft_trainings_text" });
    } catch (e) {}
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("trainings", "ix_trainings_status").catch(() => {});
    await queryInterface.removeIndex("trainings", "ix_trainings_app_window").catch(() => {});
    await queryInterface.removeIndex("trainings", "ix_trainings_start").catch(() => {});
    await queryInterface.removeIndex("trainings", "ft_trainings_text").catch(() => {});
    await queryInterface.dropTable("trainings");
  },
};

