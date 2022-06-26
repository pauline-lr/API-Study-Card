const ClientController = require("../controller/clientDB");
const AdminController = require("../controller/adminDB");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const Authorization = require("../middleware/Authorization");
const Router = require("express-promise-router");
const router = new Router;

/**
 * @swagger
 * /v1/client/login:
 *  post:
 *      tags:
 *          - Client
 *      description: Send back a JWT token for the identification
 *      requestBody:
 *          description: login for connexion
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          201:
 *            description: a JWT token
 *            content:
 *                text/plain:
 *                    schema:
 *                        type: string
 *          400:
 *              description: Pseudo and/or password are empty
 *          404:
 *              description: Client not found
 *          500:
 *              description: Server error
 *
 */
router.post('/login', ClientController.login);

/**
 * @swagger
 * /v1/client/admin:
 *  post:
 *      tags:
 *          - Admin
 *      description: Send back a JWT token for the identification
 *      requestBody:
 *          description: login for connexion
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Admin'
 *      responses:
 *          201:
 *            description: a JWT token
 *            content:
 *                text/plain:
 *                    schema:
 *                        type: string
 *          400:
 *              description: Pseudo and/or password are empty
 *          404:
 *              description: Admin not found
 *          500:
 *              description: Server error
 */
router.post('/admin', AdminController.login);

/**
 * @swagger
 * /v1/client:
 *  post:
 *      tags:
 *          - Client
 *      requestBody:
 *          $ref: '#/components/requestBodies/ClientToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/ClientAdd'
 *          400:
 *              $ref: '#/components/responses/IncorrectClientBody'
 *              description : Pseudo or email already use
 *          500:
 *              description: Server error
 *
 */
router.post('/', ClientController.inscriptionClient);

/**
 * @swagger
 * /v1/client/all:
 *  get:
 *      tags:
 *         - Client
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ClientDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/NoClientFound'
 *          500:
 *              description: Server error
 *
 */
router.get('/all', JWTMiddleWare.identification, Authorization.mustBeAdmin, ClientController.getAllClients);

/**
 * @swagger
 * /v1/client/{pseudo}:
 *  get:
 *      tags:
 *         - Client
 *      parameters:
 *          - name: pseudo
 *            description: client's nickname
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ClientFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/isMyAccountOrAdmin'
 *          404:
 *              $ref: '#/components/responses/ClientNotFound'
 *          500:
 *              description: Server error
 *
 */
router.get('/:pseudo', JWTMiddleWare.identification, Authorization.isMyAccountOrAdmin, ClientController.getClient);

/**
 * @swagger
 * /v1/client:
 *  patch:
 *      tags:
 *          - Client
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ClientToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ClientUpdated'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *              description : Wrong parameter(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/ClientNotFound'
 *          500:
 *              description: Server error
 *
 */
router.patch('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, ClientController.updateClient);

/**
 * @swagger
 * /v1/client:
 *  delete:
 *      tags:
 *          - Client
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ClientDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/ClientNotFound'
 *          500:
 *              description: Server error
 */
router.delete('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, ClientController.deleteClient);

module.exports = router;