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
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Artist name is required'
                },
                isAlpha: {
                    args: true,
                    msg: 'Artist name must contain only letters'
                },
                len: {
                    args: [2, 10],
                    msg: 'Artist name must be between 2 and 10 characters'
                },
                // is: /^[a-e]+$/i
            }
        },
        surname: {
            field: 'Surname',
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                customValidator(value) {
                    if (value === null && this.name.length < 3){
                        throw new Error('Artist name must be at least 3 characters if surname is empty');
                    }
                },
                // not: /^[a-e]+$/i
            }
        },
        email:{
            field: 'Email',
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true,
                customValidator(value) {
                    if(this.email && value[value.length-1] !== 'r' && value[value.length-2] !== 'f' && value[value.length-3] !== '.'){
                        throw new Error('Email must end with .fr');
                    }
                }
            }
        },
        age: {
            field: 'Age',
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 12,
                max: 80,
                notIn: {
                    args: [[25, 27, 29, 31, 33]],
                    msg: 'Age must not be 25, 27, 29, 31 or 33'
                },
                isOdd(value) {
                    if (value % 2 === 0) {
                        throw new Error('Age must be odd');
                    }
                }
            }
        },
        password: {
            field: 'Password',
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                customValidator(value) {
                    if(this.password && (value === "password" || value === "123456" || value === "p@ssw0rd" || value === "098765")) {
                        throw new Error('Password is too weak');
                    }
                }
            }
        }
    },{
        tableName: 'Artist',
        timestamps: false,
        validate: {
            customValidator() {
                if(this.name === this.password){
                    throw new Error('Artist name and surname must be different');
                }
            }
        }
    }
);
