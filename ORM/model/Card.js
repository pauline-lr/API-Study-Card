const {DataTypes, Deferrable} = require('sequelize');
const sequelize = require('../sequelize');
const Deck = require('./Deck');
const RevisionCategory  = require('./RevisionCategory');

const Card = sequelize.define('card', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    deck_id :{
        type : DataTypes.INTEGER,
        references:{
            model: Deck,
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        },
    },

    category_id :{
        type : DataTypes.INTEGER,
        references:{
            model: RevisionCategory,
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
    },

    front_card :{
        type: DataTypes.STRING,
        allowNull: false
    },

    back_card :{
        type: DataTypes.STRING,
    },
},  {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Card;