const sequelize = require('../database/db');
const {DataTypes} = require('sequelize');

module.exports = sequelize.define('track', {
        id: {
            field: 'TrackId',
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            field: 'Name',
            type: DataTypes.STRING,
        }
    },
    {
        tableName: 'Track', timestamps: false,
    }
);
