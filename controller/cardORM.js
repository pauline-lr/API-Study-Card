const CardORM = require('../ORM/model/Card');
const DeckORM = require('../ORM/model/Deck');
const CategoryORM = require('../ORM/model/RevisionCategory');

const MSG_PARAMETER_WRONG = "Wrong Parameter(s)";
const MSG_DECK_NOT_FOUND = "Deck not found";
const MSG_CARD_NOT_FOUND = "Card not found";
const MSG_DECK_ID_NAN = "Id's deck is NAN";
const MSG_CARD_ID_NAN = "Id's card is NAN";

/**
 * @swagger
 * components:
 *  schemas:
 *      DeckOfCards:
 *          type: array
 *          items:
 *              $ref: '#/components/schemas/Card'
 */
/**
 * @swagger
 * components:
 *  responses:
 *      CardsInDeckFound:
 *           description: send back array of all cards in the deck
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/DeckOfCards'
 *      DeckNoFound:
 *          description: Deck not found
 */
module.exports.getCardsOfDeck = async (req, res) => {
    const idText = req.params.id;
    const deck_id = parseInt(idText);
    try {
        if (isNaN(deck_id)) {
            res.status(400).json({error: MSG_DECK_ID_NAN});
        } else {
            const deck = await DeckORM.findOne({where: {id: deck_id}});
            if (deck !== null) {

                const cards_in_deck = await CardORM.findAll({where: {deck_id: deck_id}});
                const cards = [];

                if (cards_in_deck !== null) {
                    for (const cardDB of cards_in_deck) {
                        const {id, category_id, front_card, back_card} = cardDB;

                        const card = {
                            id: id,
                            category_id: category_id,
                            front_card: front_card,
                            back_card: back_card
                        };
                        cards.push(card);
                    }
                }
                res.json(cards);
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
 *      Card:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              deck_id:
 *                  type: integer
 *              category_id:
 *                  type: integer
 *              front_card:
 *                  type: string
 *              back_card:
 *                  type: string
 */
/**
 * @swagger
 * components:
 *  responses:
 *      CardFound:
 *           description: send a card
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Card'
 *      NoCardFound:
 *          description: Card not found
 */
module.exports.getCard = async (req, res) => {
    const idText = req.params.id;
    const id = parseInt(idText);

    try {
        if (isNaN(id)) {
            res.status(400).json({error: MSG_CARD_ID_NAN});
        } else {
            const cardDB = await CardORM.findOne({where: {id: id}});
            if (cardDB !== null) {
                const {id, deck_id, category_id, front_card, back_card} = cardDB;
                const deck_of_card = await DeckORM.findOne({where: {id: deck_id}});

                const card = {
                    id: id,
                    deck_id: deck_of_card,
                    category_id: category_id,
                    front_card: front_card,
                    back_card: back_card
                };
                res.json(card);
            } else {
                res.status(404).json({error: MSG_CARD_NOT_FOUND});
            }
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
 *          CardAdd:
 *              description: The card has been  added to database
 *          IncorrectCardBody:
 *              description: At least one parameter in body is wrong or no parameter
 *      requestBodies:
 *          CardToAdd:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              deck_id:
 *                                  type: integer
 *                              category_id:
 *                                  type: integer
 *                              front_card:
 *                                  type: string
 *                              back_card:
 *                                  type: string
 *                          required:
 *                              - deck_id
 *                              - category_id
 *                              - front_card
 */
module.exports.postCard = async (req, res) => {
    const {deck_id, category_id, front_card, back_card} = req.body;
    try {
        if (await deckValid(deck_id)) {
            if (await cardValid(category_id, front_card, back_card)) {
                await CardORM.create({
                    deck_id, category_id, front_card, back_card
                });
                res.sendStatus(201);
            } else {
                res.sendStatus(400).send(MSG_PARAMETER_WRONG);
            }
        } else {
            res.sendStatus(404).send(MSG_DECK_NOT_FOUND);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function cardValid(category_id, front_card, back_card) {
    if (back_card !== null) {
        if (back_card.length > 1000)
            return false;
    }

    return ((await CategoryORM.findOne({where: {id: category_id}})) !== null) && front_card.length < 250;
}

async function deckValid(deck_id) {
    return (await DeckORM.findOne({where: {id: deck_id}})) !== null;
}

/**
 * @swagger
 *  components:
 *      responses:
 *          CardUpdated:
 *              description: The card has been updated
 *      requestBodies:
 *          CardToUpdate:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              deck_id:
 *                                  type: integer
 *                              category_id:
 *                                  type: integer
 *                              front_card:
 *                                  type: string
 *                              back_card:
 *                                  type: string
 *                          required:
 *                              - id
 *                              - deck_id
 *                              - category_id
 *                              - front_card
 */
module.exports.updateCard = async (req, res) => {
    const {id, category_id, front_card, back_card} = req.body;
    try {
        const cardDB = await CardORM.findOne({where: {id: id}});
        if (cardDB !== null) {
            if (await cardValid(category_id, front_card, back_card)) {
                await CardORM.update({category_id, front_card, back_card}, {where: {id}});
                res.sendStatus(201);
            } else {
                res.sendStatus(400).send({error: MSG_PARAMETER_WRONG});
            }
        } else {
            res.sendStatus(404).send({error: MSG_CARD_NOT_FOUND});
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
 *      CardDeleted:
 *          description: The card has been deleted
 */
module.exports.deleteCard = async (req, res) => {
    const {id} = req.body;
    try {
        const cardDB = await CardORM.findOne({where: {id: id}});
        if (cardDB !== null) {
            await CardORM.destroy({where: {id}});
            res.sendStatus(204);
        } else {
            res.sendStatus(404).send({error: MSG_CARD_NOT_FOUND});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}