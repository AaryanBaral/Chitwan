import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const Notice = sequelize.define(
  "Notice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      allowNull: false,
      defaultValue: "draft",
    },
    isPopup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_popup",
    },
    displayFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "display_from",
    },
    displayTo: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "display_to",
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    linkUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "link_url",
    },
    attachment: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  },
  {
    tableName: "notices",
    timestamps: true,
    underscored: true,
  }
);

export default Notice;

