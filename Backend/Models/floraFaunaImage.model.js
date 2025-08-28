import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const FloraFaunaImage = sequelize.define(
  "FloraFaunaImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    floraFaunaId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "flora_fauna_id",
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "alt_text",
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "sort_order",
    },
  },
  {
    tableName: "flora_fauna_images",
    timestamps: true,
    underscored: true,
  }
);

export default FloraFaunaImage;

