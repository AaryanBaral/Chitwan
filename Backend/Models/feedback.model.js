import { DataTypes } from "sequelize";
import { sequelize } from "../Connection/database.js";

const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "full_name",
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER, // 1..5
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("new", "reviewed", "resolved", "archived"),
      defaultValue: "new",
    },
  },
  {
    tableName: "feedbacks",
    timestamps: true,
    underscored: true,
  }
);

export default Feedback;

