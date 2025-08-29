import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const TrainingRegistration = sequelize.define(
  "TrainingRegistration",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    trainingId: { type: DataTypes.UUID, allowNull: false, field: "training_id" },

    registrantName: { type: DataTypes.STRING(150), allowNull: false, field: "registrant_name" },
    registrantEmail: { type: DataTypes.STRING(191), allowNull: true, field: "registrant_email", validate: { isEmail: true } },
    registrantPhone: { type: DataTypes.STRING(20), allowNull: true, field: "registrant_phone" },
    citizenshipNo: { type: DataTypes.STRING(50), allowNull: true, field: "citizenship_no" },
    organization: { type: DataTypes.STRING(150), allowNull: true },
    address: { type: DataTypes.STRING(255), allowNull: true },

    registrationStatus: { type: DataTypes.ENUM("pending", "confirmed", "waitlisted", "cancelled"), allowNull: false, defaultValue: "pending", field: "registration_status" },
    submittedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: "submitted_at" },
  },
  { tableName: "training_registrations", timestamps: true, underscored: true }
);

export default TrainingRegistration;

