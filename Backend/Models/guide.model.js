import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const Guide = sequelize.define(
  "Guide",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    citizenshipNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    licenseNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: true,
      unique: true,
      validate: { isEmail: true },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    languages: {
      type: DataTypes.TEXT, // store as comma-separated string (or JSON)
      allowNull: true,
    },
    specialization: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "suspended", "retired"),
      defaultValue: "active",
    },
  },
  {
    tableName: "guides",
    timestamps: true,
    underscored: true,
  }
);

export default Guide;
