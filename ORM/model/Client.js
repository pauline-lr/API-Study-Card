const {DataTypes} = require('sequelize');
const sequelize = require('../sequelize');

const Client = sequelize.define('"client"', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    pseudo :{
        type : DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password :{
        type : DataTypes.STRING,
        allowNull: false
    },

    email :{
        type : DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},  {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Client;