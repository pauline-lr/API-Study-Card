require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');
const {Sequelize} = require("sequelize");
const sequelize = require("../ORM/sequelize");
const pool = require('../model/database');
const clientDB = require('../model/clientDB');
const ClientORM = require("../ORM/model/Client");
const SessionORM = require("../ORM/model/Session");
const CardORM = require("../ORM/model/Card");
const DeckORM = require("../ORM/model/Deck");
const ClientModel = require("../model/clientDB");

const USERNAME_REGEX = new RegExp("^[a-z0-9_-]{3,15}$");
const EMAIL_REGEX = new RegExp("[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+");
const MSG_CLIENT_NOT_FOUND = "Client not found";
const MSG_PARAMETER_WRONG = "Parameter(s) wrong(s)";
const MSG_PSEUDO_MAIL_ALREADY_USE = "Pseudo or email already use";

/**
 * @swagger
 * components:
 *  schemas:
 *      Login:
 *          type: object
 *          properties:
 *              pseudo:
 *                  type: string
 *              password:
 *                  type: string
 *                  format: password
 *          required:
 *              - pseudo
 *              - password
 */
module.exports.login = async (req, res) => {
    const {pseudo, password} = req.body;
    if (!pseudo || !password) {
        res.sendStatus(400).send(MSG_PARAMETER_WRONG);
    } else {
        const client = await pool.connect();
        try {
            const result = await clientDB.getClient(client, pseudo, password);
            const {clientType, value} = result;
            if (clientType === "unknown") {
                res.status(404).json({error: MSG_CLIENT_NOT_FOUND});
            } else if (clientType === "admin") {
                const {pseudo} = value;
                const payload = {status: clientType, value: {pseudo}};
                const token = jwt.sign(
                    payload,
                    process.env.SECRET_TOKEN,
                    {expiresIn: '4h'}
                );
                res.json(token);
            } else if (clientType === "client") {
                const {id, pseudo} = value;
                const payload = {status: clientType, value: {id, pseudo}};
                const token = jwt.sign(
                    payload,
                    process.env.SECRET_TOKEN,
                    {expiresIn: '4h'}
                );
                res.json(token);
            }
        } catch (error) {
                console.error(error);
                res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};

/**
 * @swagger
 * components:
 *  schemas:
 *      Client:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              pseudo:
 *                  type: string
 *              email:
 *                  type: string
 *              is_admin:
 *                  type: boolean
 */
/**
 * @swagger
 * components:
 *  responses:
 *      ClientFound:
 *           description: send a client
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Client'
 *      ClientNotFound:
 *           description: client not found
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Client'

 */
module.exports.getClient = async (req, res) => {
    const pseudo = req.params.pseudo;
    try {
        const clientDB = await ClientORM.findOne({where: {pseudo: pseudo}});
        if (clientDB !== null) {
            const {id, pseudo, email, is_admin} = clientDB;
            const client = {
                id: id,
                pseudo: pseudo,
                email: email,
                is_admin: is_admin
            }
            res.json(client);
        } else {
            res.status(404).json({error: MSG_CLIENT_NOT_FOUND});
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
 *      ArrayOfClients:
 *          type: array
 *          items:
 *              $ref: '#/components/schemas/Client'
 */
/**
 * @swagger
 * components:
 *  responses:
 *      ClientsFound:
 *           description: send back array of all clients
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/ArrayOfClients'
 *      NoClientFound:
 *          description: No Client found
 */
module.exports.getAllClients = async (req, res) => {
    try {
        const allClients = await ClientORM.findAll({order: [['id', 'ASC']]});
        const clients = [];
        for (const clientDB of allClients) {
            const client = {
                id: clientDB.id,
                pseudo: clientDB.pseudo,
                email: clientDB.email,
                is_admin: clientDB.is_admin
            }
            clients.push(client);
        }
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * @swagger
 *  components:
 *      responses:
 *          ClientUpdated:
 *              description: The client has been updated
 *      requestBodies:
 *          ClientToUpdate:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              pseudo:
 *                                  type: string
 *                              password:
 *                                  type: string
 *                                  format: password
 *                              email:
 *                                  type: string
 *                              is_admin:
 *                                  type: string
 *                          required:
 *                              - id
 *                              - pseudo
 *                              - password
 *                              - email
 *                              - is_admin
 */
module.exports.updateClient = async (req, res) => {
    const upClient = req.body;

    if (upClient.id === undefined || !(await clientValid(upClient.pseudo, upClient.password, upClient.email, upClient.is_admin))) {
        res.sendStatus(400);
    } else {
        const clientDB = await ClientORM.findOne({where: {id: upClient.id}});

        if (clientDB === null) {
            res.status(404).send({error: MSG_CLIENT_NOT_FOUND});
        } else {
            if (await emailPseudoAlreadyUseByOtherClient(upClient.pseudo, upClient.email, upClient.id)) {
                res.status(400).send(MSG_PSEUDO_MAIL_ALREADY_USE + " by another client");
            } else {
                const client = await pool.connect();

                try {
                    await ClientModel.updateClient(
                        client,
                        upClient.id,
                        upClient.pseudo,
                        upClient.password,
                        upClient.email,
                        upClient.is_admin
                    );

                    res.sendStatus(204);
                } catch (error) {
                    console.error(error);
                    res.sendStatus(500);
                } finally {
                    client.release();
                }
            }
        }
    }
};

/**
 * @swagger
 *  components:
 *      responses:
 *          ClientAdd:
 *              description: The client has been  added to database
 *          IncorrectClientBody:
 *              description: At least one parameter in body is wrong or no parameter
 *      requestBodies:
 *          ClientToAdd:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              pseudo:
 *                                  type: string
 *                              password:
 *                                  type: string
 *                                  format: password
 *                              email:
 *                                  type: string
 *                              is_admin:
 *                                  type: boolean
 *                          required:
 *                              - pseudo
 *                              - password
 *                              - email
 *                              - is_admin
 */
module.exports.inscriptionClient = async (req, res) => {
    const pseudo = req.body.pseudo;
    const password = req.body.password;
    const email = req.body.email;
    const is_admin = req.body.is_admin;

    if (!(await clientValid(pseudo, password, email, is_admin))) {
        return res.status(400).json({error: MSG_PARAMETER_WRONG});
    }
    if (await alreadyUse(pseudo, email)) {
        return res.status(400).json({error: MSG_PSEUDO_MAIL_ALREADY_USE});
    } else {
        const client = await pool.connect();
        try {
            await ClientModel.postClient(client, pseudo, password, email, is_admin);
            res.sendStatus(201);
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};

/**
 *@swagger
 *components:
 *  responses:
 *      ClientDeleted:
 *          description: The client has been deleted
 */
module.exports.deleteClient = async (req, res) => {
    const {id} = req.body;
    try {
        const decksDB = await DeckORM.findAll({where: {client_id: id}});
        const clientDB = await ClientORM.findOne({where: {id: id}});
        if (clientDB !== null) {
            await sequelize.transaction({
                deferrable: Sequelize.Deferrable.SET_DEFERRED
            }, async (t) => {
                for (const deckDB of decksDB) {
                    const {id} = deckDB;
                    await CardORM.destroy({where: {deck_id: id}, transaction: t});
                    await SessionORM.destroy({where: {deck_id: id}, transaction: t});
                }
                await DeckORM.destroy({where: {client_id: id}, transaction: t});
                await ClientORM.destroy({where: {id: id}, transaction: t});
                return res.sendStatus(204);
            });
        } else {
            res.status(404).json({error: MSG_CLIENT_NOT_FOUND});
        }
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
};

async function alreadyUse(pseudo, email) {
    const clientDB = await ClientORM.findOne({where: {pseudo: pseudo}});
    const emailDB = await ClientORM.findOne({where: {email: email}});
    return emailDB !== null || clientDB !== null;
}

async function clientValid(pseudo, password, email, is_admin) {
    return EMAIL_REGEX.test(email) &&
        USERNAME_REGEX.test(pseudo) &&
        password !== undefined && is_admin !== undefined &&
        password !== null && is_admin !== null;
}

async function emailPseudoAlreadyUseByOtherClient(pseudo, email, client_id) {
    const emailDB = await ClientORM.findOne({where: {email: email}});
    const pseudoDB = await ClientORM.findOne({where: {pseudo: pseudo}});

    if (emailDB !== null) {
        if (emailDB.id !== client_id) {
            return true;
        }
    }
    if (pseudoDB !== null) {
        if (pseudoDB.id !== client_id) {
            return true;
        }
    }
    return false;
}
