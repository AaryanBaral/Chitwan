import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const Hotel = sequelize.define(
  "Hotel",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    zip: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    contactName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING(191),
      allowNull: true,
      validate: { isEmail: true },
    },
    contactPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    images: {
      type: DataTypes.TEXT, // store JSON array of file paths
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    tableName: "hotels",
    timestamps: true,
    underscored: true,
  }
);

export default Hotel;
