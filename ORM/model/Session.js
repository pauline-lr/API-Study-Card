const {DataTypes, Deferrable} = require('sequelize');
const sequelize = require('../sequelize');
const Deck = require('./Deck');


const Session = sequelize.define('session', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    deck_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Deck,
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Session;