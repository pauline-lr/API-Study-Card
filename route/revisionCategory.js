const RevisionCategoryController = require("../controller/revisionCategoryORM");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const Authorization = require("../middleware/Authorization");
const Router = require("express-promise-router");
const router = new Router;

/**
 * @swagger
 * /v1/category/all/:
 *  get:
 *      tags:
 *         - RevisionsCategory
 *      responses:
 *          200:
 *              $ref: '#/components/responses/RevisionCategoryFound'
 *          404:
 *              description: Revision Category not found
 *          500:
 *              description: Server error
 */
router.get('/all', RevisionCategoryController.getAllCategories);


/**
 * @swagger
 * /v1/category/{category_id}:
 *  get:
 *      tags:
 *         - RevisionCategory
 *      parameters:
 *          - name: category_id
 *            description: revision category's ID
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *             $ref: '#/components/responses/RevisionCategoryFound'
 *          404:
 *              description: Category not found
 *          500:
 *             description: Server error
 */
router.get('/:id', RevisionCategoryController.getCategory);

/**
 * @swagger
 * /v1/category:
 *  post:
 *      tags:
 *          - RevisionCategory
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/RevisionCategoryToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/RevisionCategoryAdd'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Server error
 *
 */
router.post('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, RevisionCategoryController.postCategory);

/**
 * @swagger
 * /v1/category:
 *  post:
 *      tags:
 *          - RevisionCategory
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/RevisionCategoryToUpdate'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/RevisionCategoryUpdated'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Server error
 *
 */
router.patch('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, RevisionCategoryController.updateCategory);

/**
 * @swagger
 * /v1/category:
 *  delete:
 *      tags:
 *          - RevisionCategory
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          204:
 *              $ref: '#/components/responses/RevisionCategoryDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Server error
 */
router.delete('/', JWTMiddleWare.identification, Authorization.mustBeAdmin, RevisionCategoryController.deleteCategory);

module.exports = router;