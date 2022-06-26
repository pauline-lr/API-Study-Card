const SessionController = require("../controller/sessionORM");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const Authorization = require("../middleware/Authorization");
const Router = require("express-promise-router");
const router = new Router;

/**
 * @swagger
 * /v1/session/{session_id}:
 *  get:
 *      tags:
 *         - Session
 *      parameters:
 *          - name: session_id
 *            description: session's ID
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/SessionFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *              description: The id is not a number
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeClientOrAdmin'
 *          404:
 *              description: Session not found
 *          500:
 *              description: Server error
 */
router.get('/:id', JWTMiddleWare.identification, Authorization.mustBeClientOrAdmin, SessionController.getSession);

/**
 * @swagger
 * /v1/session:
 *  post:
 *      tags:
 *          - Session
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/SessionToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/SessionAdd'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeClientOrAdmin'
 *          500:
 *              description: Server error
 */
router.post('/', JWTMiddleWare.identification, Authorization.mustBeClientOrAdmin, SessionController.postSession);

/**
 * @swagger
 * /v1/session:
 *  patch:
 *      tags:
 *          - Session
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/SessionToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/SessionUpdated'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeClientOrAdmin'
 *          500:
 *              description: Server error
 *
 */
router.patch('/', JWTMiddleWare.identification, Authorization.mustBeClientOrAdmin, SessionController.updateSession);

/**
 * @swagger
 * /v1/session:
 *  delete:
 *      tags:
 *          - Session
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          204:
 *              $ref: '#/components/responses/SessionDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Server error
 */
router.delete('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, SessionController.deleteSession);

module.exports = router;