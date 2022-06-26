const SessionORM = require('../ORM/model/Session');
const DeckORM = require('../ORM/model/Deck');
const ClientORM = require('../ORM/model/Client');

const MSG_SESSION_NOT_FOUND = "Revision category not found";
const MSG_SESSION_ID_NAN = "Id's Revision category  is NAN";
const MSG_NOT_OWNER_ACCOUNT = "You can't perform this action if it's not your account or you're not administrator";


/**
 * @swagger
 * components:
 *  schemas:
 *      Session:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              completed:
 *                  type: boolean
 *              deck_id:
 *                  type: integer
 */
/**
 * @swagger
 * components:
 *  responses:
 *      SessionFound:
 *           description: send a session
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Session'
 */
module.exports.getSession = async (req, res) => {
    const idText = req.params.id;
    const id = parseInt(idText);

    try {
        if (isNaN(id)) {
            res.sendStatus(400).send({error: {MSG_SESSION_ID_NAN}});
        } else {
            const sessionDB = await SessionORM.findOne({where: {id: id}});
            if (sessionDB !== null) {
                const {id, completed, deck_id} = sessionDB;
                let session = {id, completed, deck_id};
                res.json(session);
            } else {
                res.sendStatus(404).send({error: {MSG_SESSION_NOT_FOUND}});
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
 *          SessionAdd:
 *              description: The session has been  added to database
 *          IncorrectSessionBody:
 *              description: At least one parameter in body is wrong or no parameter
 *      requestBodies:
 *          SessionToAdd:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              completed:
 *                                  type: boolean
 *                              deck_id:
 *                                  type: integer
 *                          required:
 *                              - id
 *                              - completed
 *                              - deck_id
 */
module.exports.postSession = async (req, res) => {
    const body = req.body;
    const {completed, deck_id} = body;
    const pseudo = req.session.pseudo;
    try {
        const deckDB = await DeckORM.findOne({where: {id: deck_id}});
        if (deckDB !== null) {
            const ownerSession = await ClientORM.findOne({where: {id: deckDB.client_id}});
            if ((ownerSession.pseudo).localeCompare(pseudo) === 0) {
                if (await sessionValid(completed, deck_id) && await deckValid(deck_id)) {
                    if (await deckAlreadyHasSession(deck_id)) {
                        await SessionORM.create({
                            completed, deck_id
                        });
                        res.sendStatus(201);
                    } else {
                        res.sendStatus(400).send({error: "There is already a session associated with this deck"});
                    }
                }
            } else {
                res.sendStatus(403).send({error: {MSG_NOT_OWNER_ACCOUNT}});
            }
        } else {
            res.sendStatus(404).send({error: "Deck doesn't exist"});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function deckValid(deck_id) {
    if (deck_id === undefined) {
        return false;
    }
    const deckDB = await DeckORM.findOne({where: {id: deck_id}});
    return deckDB !== null;
}

async function sessionValid(completed) {
    return completed != null;
}

async function deckAlreadyHasSession(deck_id) {
    const sessionsDB = await SessionORM.findAll();

    for (const session of sessionsDB) {
        if (session.deck_id === deck_id) {
            return false;
        }
    }
    return true;
}


/**
 * @swagger
 *  components:
 *      responses:
 *          SessionUpdated:
 *              description: The session has been updated
 *      requestBodies:
 *          SessionToUpdate:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              completed:
 *                                  type: boolean
 *                              deck_id:
 *                                  type: integer
 *                          required:
 *                              - id
 *                              - completed
 *                              - deck_id
 */
module.exports.updateSession = async (req, res) => {
    const {id, completed} = req.body;
    const pseudo = req.session.pseudo;

    try {
        const sessionDB = await SessionORM.findOne({where: {id: id}});
        if (sessionDB !== null) {
            const deckDB = await DeckORM.findOne({where: {id: sessionDB.deck_id}});
            const ownerSession = await ClientORM.findOne({where: {id: deckDB.client_id}});

            if ((ownerSession.pseudo).localeCompare(pseudo) === 0) {
                if (await sessionValid(id, completed)) {
                    await SessionORM.update({completed}, {where: {id}});
                    res.sendStatus(204);
                }
            } else {
                res.sendStatus(403).send({error: {MSG_NOT_OWNER_ACCOUNT}});
            }
        } else {
            res.sendStatus(404).send({error: {MSG_SESSION_NOT_FOUND}});
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
 *      SessionDeleted:
 *          description: The session has been deleted
 */
module.exports.deleteSession = async (req, res) => {
    const {id} = req.body;

    try {
        const sessionDB = await SessionORM.findOne({where: {id: id}});
        if (sessionDB !== null) {
            await SessionORM.destroy({where: {id : id}});
            res.sendStatus(204);
        } else {
            res.sendStatus(404).send({error: {MSG_SESSION_NOT_FOUND}});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}