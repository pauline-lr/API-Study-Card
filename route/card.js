const CardController = require("../controller/cardORM");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const Authorization = require("../middleware/Authorization");
const Router = require("express-promise-router");
const router = new Router;

/**
 * @swagger
 * /v1/card/all/{deck_id}:
 *  get:
 *      tags:
 *         - Card
 *      parameters:
 *          - name: deck_id
 *            description: deck's ID
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/CardsInDeckFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *              description : deck's id is NAN
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeClientOrAdmin'
 *          404:
 *              $ref: '#/components/responses/DeckNoFound'
 *          500:
 *              description: Server error
 *
 */
router.get('/all/:id', JWTMiddleWare.identification, Authorization.mustBeClientOrAdmin, CardController.getCardsOfDeck);

/**
 * @swagger
 * /v1/card/{card_id}:
 *  get:
 *      tags:
 *         - Card
 *      parameters:
 *          - name: card_id
 *            description: card's ID
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/CardFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *              description: card's ID is NAN
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeClientOrAdmin'
 *          404:
 *              $ref: '#/components/responses/NoCardFound'
 *          500:
 *              description: Server error
 *
 */
router.get('/:id', JWTMiddleWare.identification, Authorization.mustBeClientOrAdmin, CardController.getCard);

/**
 * @swagger
 * /v1/card:
 *  post:
 *      tags:
 *          - Card
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/CardToAdd'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/CardAdd'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Server error
 */
router.post('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, CardController.postCard);

/**
 * @swagger
 * /v1/card:
 *  patch:
 *      tags:
 *          - Card
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/CardToUpdate'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/CardUpdated'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/NoCardFound'
 *          500:
 *              description: Server error
 *
 */
router.patch('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, CardController.updateCard);

/**
 * @swagger
 * /v1/card:
 *  delete:
 *      tags:
 *          - Card
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          204:
 *              $ref: '#/components/responses/CardDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/NoCardFound'
 *          500:
 *              description: Server error
 *
 */
router.delete('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, CardController.deleteCard);

module.exports = router;