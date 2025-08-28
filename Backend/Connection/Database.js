// Connection/Database.js
import { Sequelize } from "sequelize";



const sequelize = new Sequelize(
  process.env.DB_NAME, // myapp
  process.env.DB_USER, // root
  process.env.DB_PASS, // Password123!
  {
    host: process.env.DB_HOST,   // 127.0.0.1
    port: process.env.DB_PORT,   // 3306
    dialect: "mysql",
    logging: false,
  }
);



export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

export { sequelize };
