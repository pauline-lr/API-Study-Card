require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');
const pool = require('../model/database');
const clientDB = require('../model/clientDB');

const MSG_USER_NOT_FOUND = "Client not found";

/**
 * @swagger
 * components:
 *  schemas:
 *      Admin:
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
        res.sendStatus(400).send("Pseudo and/or password are empty");
    } else {
        const client = await pool.connect();
        try {
            const result = await clientDB.getClient(client, pseudo, password);
            const {clientType, value} = result;
            if (clientType === "admin") {
                const {pseudo} = value;
                const payload = {status: clientType, value: {pseudo}};
                const token = jwt.sign(
                    payload,
                    process.env.SECRET_TOKEN,
                    {expiresIn: '2h'}
                );
                res.json(token);
            } else {
                res.status(404).json({error: MSG_USER_NOT_FOUND});
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};
