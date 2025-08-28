import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const HotelImage = sequelize.define(
  "HotelImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hotelId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "hotel_id",
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
    tableName: "hotel_images",
    timestamps: true,
    underscored: true,
  }
);

export default HotelImage;

