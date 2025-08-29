"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("training_registrations", {
      id: { type: Sequelize.DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: Sequelize.literal("(UUID())") },
      training_id: { type: Sequelize.DataTypes.UUID, allowNull: false },

      registrant_name: { type: Sequelize.DataTypes.STRING(150), allowNull: false },
      registrant_email: { type: Sequelize.DataTypes.STRING(191), allowNull: true },
      registrant_phone: { type: Sequelize.DataTypes.STRING(20), allowNull: true },
      citizenship_no: { type: Sequelize.DataTypes.STRING(50), allowNull: true },
      organization: { type: Sequelize.DataTypes.STRING(150), allowNull: true },
      address: { type: Sequelize.DataTypes.STRING(255), allowNull: true },

      registration_status: { type: Sequelize.DataTypes.ENUM("pending", "confirmed", "waitlisted", "cancelled"), allowNull: false, defaultValue: "pending" },

      submitted_at: { type: Sequelize.DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      created_at: { type: Sequelize.DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("training_registrations", {
      fields: ["training_id"],
      type: "foreign key",
      name: "fk_reg_training",
      references: { table: "trainings", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("training_registrations", ["training_id", "registrant_email"], { name: "ux_reg_training_email", unique: true });
    await queryInterface.addIndex("training_registrations", ["training_id", "registrant_phone"], { name: "ux_reg_training_phone", unique: true });
    await queryInterface.addIndex("training_registrations", ["training_id", "registration_status"], { name: "ix_reg_training_status" });
    await queryInterface.addIndex("training_registrations", ["submitted_at"], { name: "ix_reg_submitted_at" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("training_registrations", "ux_reg_training_email").catch(() => {});
    await queryInterface.removeIndex("training_registrations", "ux_reg_training_phone").catch(() => {});
    await queryInterface.removeIndex("training_registrations", "ix_reg_training_status").catch(() => {});
    await queryInterface.removeIndex("training_registrations", "ix_reg_submitted_at").catch(() => {});
    await queryInterface.removeConstraint("training_registrations", "fk_reg_training").catch(() => {});
    await queryInterface.dropTable("training_registrations");
  },
};

