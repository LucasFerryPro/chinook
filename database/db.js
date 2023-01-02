const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
    }
);

module.exports = sequelize;