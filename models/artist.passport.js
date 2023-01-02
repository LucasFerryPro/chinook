const sequelize = require('../database/db');
const {DataTypes} = require('sequelize');

module.exports = sequelize.define('passeport',{
    id: {
        field: 'PasseportId',
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1
    },
    code: {
        field: 'Code',
        type: DataTypes.STRING,
    },
    issueDate: {
        field: 'IssueDate',
        type: DataTypes.DATEONLY
    },
    expiryDate: {
        field: 'ExpiryDate',
        type: DataTypes.DATEONLY
    }
},{
    timestamps: false,
});