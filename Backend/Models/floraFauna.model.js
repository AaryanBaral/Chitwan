import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const FloraFauna = sequelize.define(
  "FloraFauna",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("flora", "fauna"),
      allowNull: false,
    },
    commonName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    scientificName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    habitat: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    conservationStatus: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    tableName: "flora_fauna",
    timestamps: true,
    underscored: true,
  }
);

export default FloraFauna;
