import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const GuideImage = sequelize.define(
  "GuideImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    guideId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "guide_id",
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
  },
  {
    tableName: "guide_images",
    timestamps: true,
    underscored: true,
  }
);

export default GuideImage;

