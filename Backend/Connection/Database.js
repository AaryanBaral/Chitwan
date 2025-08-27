// Sequelize connection only
import { Sequelize }  from'sequelize';
import 'dotenv';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,                 // set true to see SQL
    define: { underscored: true }   // optional: snake_case columns
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected (Sequelize)');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };
