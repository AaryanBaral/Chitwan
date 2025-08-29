import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const PlaceImage = sequelize.define(
  "PlaceImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    placeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "place_id",
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
    tableName: "place_images",
    timestamps: true,
    underscored: true,
  }
);

export default PlaceImage;

