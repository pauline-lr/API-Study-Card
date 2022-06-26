const DeckORM = require('../ORM/model/Deck');
const ClientORM = require('../ORM/model/Client');
const SessionORM = require('../ORM/model/Session');
const CardORM = require('../ORM/model/Card');
const sequelize = require("../ORM/sequelize");
const {Sequelize} = require("sequelize");

const MSG_DECK_NOT_FOUND = "Deck not found";
const MSG_DECK_NAME_INVALID = "Deck name invalid (max 100 characters)";
const MSG_DECK_ID_NAN = "Id's is NAN";
const MSG_USER_NOT_FOUND = "User not found";

/**
 * @swagger
 * components:
 *  schemas:
 *      Deck:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              client:
 *                  type: object
 *              items:
 *                  $ref: '#/components/schemas/Client'
 *              deck_name:
 *                  type: string
 */
/**
 * @swagger
 * components:
 *  responses:
 *      DeckFound:
 *           description: send a deck
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Deck'
 */
module.exports.getDeck = async (req, res) => {
    const idText = req.params.id;
    const id = parseInt(idText);

    try {
        if (isNaN(id)) {
            res.status(400).json({error: MSG_DECK_ID_NAN});
        } else {
            const deckDB = await DeckORM.findOne({where: {id: id}});

            if (deckDB !== null) {
                const clientDB = await ClientORM.findOne({where: {id: deckDB.client_id}});
                if (clientDB !== null) {
                    if (req.session.authLevel === "admin") {
                        const {id, deck_name} = deckDB;
                        const {pseudo, email, is_admin} = clientDB;
                        const deck = {
                            id: id,
                            client: {pseudo, email, is_admin},
                            deck_name: deck_name,
                        }
                        res.json(deck);
                    } else if (req.session.authLevel === "client") {
                        const {id, deck_name} = deckDB;

                        const deck = {
                            id: id,
                            deck_name: deck_name,
                        }
                        res.json(deck);
                    }
                } else {
                    res.status(404).json({error: MSG_USER_NOT_FOUND});
                }
            } else {
                res.status(404).json({error: MSG_DECK_NOT_FOUND});
            }

        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

/**
 * @swagger
 * components:
 *  schemas:
 *      Decks:
 *          type: array
 *          items:
 *              $ref: '#/components/schemas/Deck'
 */
/**
 * @swagger
 * components:
 *  responses:
 *      DecksFound:
 *           description: send back array of all decks of an client
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Decks'
 *      ClientNotFound:
 *          description: Client not found
 */
module.exports.getAllDecks = async (req, res) => {
    const pseudo = req.params.pseudo;
    try {
        const clientDB = await ClientORM.findOne({where: {pseudo: pseudo}});

        if (clientDB !== null) {
            const decksDB = await DeckORM.findAll({where: {client_id: clientDB.id}, order: [['id', 'ASC']]});
            const decks = [];
            for (const deckDB of decksDB) {
                const {id, deck_name} = deckDB;

                const deck = {
                    id: id,
                    deck_name: deck_name,
                }
                decks.push(deck);
            }
            res.json(decks);
        } else {
            res.status(404).json({error: MSG_USER_NOT_FOUND});
        }
    } catch (error) {
            console.error(error);
            res.sendStatus(500);
    }
}

/**
 * @swagger
 *  components:
 *      responses:
 *          DeckAdd:
 *              description: The deck has been added to database
 *          IncorrectDeckBody:
 *              description: At least one parameter in body is wrong or no parameter
 *      requestBodies:
 *          DeckToAdd:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              pseudo:
 *                                  type: string
 *                              deck_name:
 *                                  type: string
 *                          required:
 *                              - pseudo
 *                              - deck_name
 */
module.exports.postDeck = async (req, res) => {
    const {pseudo, deck_name} = req.body;
    try {
        const client = await ClientORM.findOne({where: {pseudo: pseudo}});


        if (client !== null) {
            const client_id = client.id;
            if (await deckValid(deck_name) && await clientValid(client_id)) {
                await DeckORM.create({
                    client_id, deck_name
                });
                res.sendStatus(201);
            } else {
                res.status(400).json({error: MSG_DECK_NAME_INVALID});
            }
        } else {
            res.status(404).json({error: MSG_USER_NOT_FOUND});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function clientValid(client_id) {
    return ((await ClientORM.findOne({where: {id: client_id}}))) !== null;
}

async function deckValid(deck_name) {
    return deck_name.length <= 100 && true;
}

/**
 * @swagger
 *  components:
 *      responses:
 *          DeckUpdated:
 *              description: The deck has been updated
 *      requestBodies:
 *          DeckToUpdate:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              deck_name:
 *                                  type: string
 *                          required:
 *                              - id
 *                              - deck_name
 */
module.exports.updateDeck = async (req, res) => {
    const {id, deck_name} = req.body;
    try {
        const deck = await DeckORM.findOne({where: {id: id}});

        if (deck !== null) {
            const client_id = deck.client_id;
            if (await deckValid(deck_name) && await clientValid(client_id)) {
                await DeckORM.update({deck_name}, {where: {id}});
                res.sendStatus(201);
            } else {
                res.status(400).json({error: MSG_DECK_NAME_INVALID});
            }
        } else {
            res.status(404).json({error: MSG_DECK_NOT_FOUND});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      DeckDeleted:
 *          description: The deck has been deleted
 */
module.exports.deleteDeck = async (req, res) => {
    const {id} = req.body;
    try {
        const deckDB = await DeckORM.findOne({where: {id: id}});
        if (deckDB !== null) {
            await sequelize.transaction({
                deferrable: Sequelize.Deferrable.SET_DEFERRED
            }, async (t) => {
                await CardORM.destroy({where: {deck_id: id}, transaction: t});
                await SessionORM.destroy({where: {deck_id: id}, transaction: t});
                await DeckORM.destroy({where: {id: id}, transaction: t});
                return res.sendStatus(204);
            });
        } else {
            res.status(404).json({error: MSG_DECK_NOT_FOUND});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}