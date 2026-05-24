const Sequelize = require("sequelize");
const Dotenv = require("dotenv");
Dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
    },
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("PostgreSQL database connected and synced");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
