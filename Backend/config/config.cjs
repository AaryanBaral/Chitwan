// config/config.cjs
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,      // e.g. root
    password: process.env.DB_PASS,      // e.g. Password123!
    database: process.env.DB_NAME,      // e.g. myapp
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
  },
  // add test/production if you need
};
