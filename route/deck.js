const DeckController = require("../controller/deckORM");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const Authorization = require("../middleware/Authorization");
const Router = require("express-promise-router");
const router = new Router;


/**
 * @swagger
 * /deck/all/{pseudo}:
 *  get:
 *      tags:
 *         - Decks
 *      parameters:
 *          - name: pseudo
 *            description: pseudo's owner of the deck(s)
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/DecksFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeClientOrAdmin'
 *          404:
 *              $ref: '#/components/responses/ClientNotFound'
 *          500:
 *              description: Server error
 */
router.get('/all/:pseudo', JWTMiddleWare.identification, Authorization.mustBeClientOrAdmin, DeckController.getAllDecks);

/**
 * @swagger
 * /deck/{id}:
 *  get:
 *      tags:
 *         - Deck
 *      parameters:
 *          - name: id
 *            description: deck's ID
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/DeckFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeClientOrAdmin'
 *          404:
 *              description: Deck not found
 *              $ref: '#/components/responses/ClientNotFound'
 *          500:
 *              description: Server error
 */
router.get('/:id', JWTMiddleWare.identification, Authorization.mustBeClientOrAdmin, DeckController.getDeck);

/**
 * @swagger
 * /v1/deck:
 *  post:
 *      tags:
 *          - Deck
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/DeckToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/DeckAdd'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: Client not found
 *          500:
 *              description: Server error
 */
router.post('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, DeckController.postDeck);

/**
 * @swagger
 * /v1/deck:
 *  patch:
 *      tags:
 *          - Deck
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/DeckToUpdate'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/DeckUpdated'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: Deck not found
 *          500:
 *              description: Server error
 *
 */
router.patch('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, DeckController.updateDeck);

/**
 * @swagger
 * /v1/deck:
 *  delete:
 *      tags:
 *          - Deck
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          204:
 *              $ref: '#/components/responses/DeckDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: Deck not found
 *          500:
 *              description: Server error
 */
router.delete('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, DeckController.deleteDeck);


module.exports = router;