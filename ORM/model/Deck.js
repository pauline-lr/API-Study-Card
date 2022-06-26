const Client = require('./Client');
const Session = require('./Session');
const {DataTypes, Deferrable} = require('sequelize');
const sequelize = require('../sequelize');

const Deck = sequelize.define('deck', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },

    deck_name: {
        type: DataTypes.STRING,
        allowNull: false
    },


}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Deck;