const {DataTypes} = require('sequelize');
const sequelize = require('../sequelize');

const RevisionCategory = sequelize.define('revision_category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    category_name :{
        type : DataTypes.STRING,
        allowNull: false
    },

    difficulty_order:{
        type : DataTypes.INTEGER,
        allowNull: false
    },

    description:{
        type : DataTypes.STRING,
    },
},  {
    timestamps: false,
    freezeTableName: true,
});

module.exports = RevisionCategory;