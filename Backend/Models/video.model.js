import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const Video = sequelize.define(
  "Video",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "draft",
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "published_at",
    },
  },
  {
    tableName: "videos",
    timestamps: true,
    underscored: true,
  }
);

export default Video;
