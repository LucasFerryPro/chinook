const sequelize = require('../database/db');
const {DataTypes} = require('sequelize');

module.exports = sequelize.define('artist', {
        id: {
            field: 'ArtistId',
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            field: 'Name',
            type: DataTypes.STRING,
        }
    },
    {
        tableName: 'Artist', timestamps: false,
    }
);
