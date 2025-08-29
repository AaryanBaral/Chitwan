import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const Training = sequelize.define(
  "Training",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(220), allowNull: false, unique: true },
    summary: { type: DataTypes.STRING(500), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },

    mode: {
      type: DataTypes.ENUM("in_person", "online", "hybrid"),
      allowNull: false,
      defaultValue: "in_person",
    },
    location: { type: DataTypes.STRING(255), allowNull: true },
    department: { type: DataTypes.STRING(150), allowNull: true },
    category: { type: DataTypes.STRING(100), allowNull: true },

    startAt: { type: DataTypes.DATE, allowNull: false, field: "start_at" },
    endAt: { type: DataTypes.DATE, allowNull: false, field: "end_at" },
    applicationOpenAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "application_open_at",
    },
    applicationCloseAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "application_close_at",
    },

    maxCapacity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: "max_capacity",
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "closed", "cancelled"),
      allowNull: false,
      defaultValue: "draft",
    },

    eligibility: { type: DataTypes.STRING(255), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "trainings", timestamps: true, underscored: true }
);

export default Training;
