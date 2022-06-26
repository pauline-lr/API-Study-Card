const CategoryORM = require('../ORM/model/RevisionCategory');
const sequelize = require("../ORM/sequelize");
const {Sequelize} = require("sequelize");
const CardORM = require("../ORM/model/Card");

const MSG_PARAMETER_WRONG = "Parameter(s) wrong(s)";
const MSG_CATEGORY_NOT_FOUND = "Revision category not found";
const MSG_CATEGORY_ID_NAN = "Id's Revision category  is NAN";
const MSG_CANNOT_DELETE_CATEGORY = `The "Not category" is the only one that cannot be deleted`;

/**
 * @swagger
 * components:
 *  schemas:
 *      RevisionCategory:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              category_name:
 *                  type: string
 *              difficulty_order:
 *                  type: integer
 *              description:
 *                  type: string
 */
/**
 * @swagger
 * components:
 *  responses:
 *      RevisionCategoryFound:
 *           description: send a revision category
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/RevisionCategory'
 */
module.exports.getCategory = async (req, res) => {
    const idText = req.params.id;
    const id = parseInt(idText);

    try {
        if (isNaN(id)) {
            res.sendStatus(400).send({error: MSG_CATEGORY_ID_NAN});
        } else {
            const categoryDB = await CategoryORM.findOne({where: {id: id}});
            if (categoryDB !== null) {
                const {id, category_name, difficulty_order, description} = categoryDB;

                const category = {
                    id: id,
                    category_name: category_name,
                    difficulty_order: difficulty_order,
                    description: description
                };
                res.json(category);
            } else {
                res.sendStatus(404).send({error: MSG_CATEGORY_NOT_FOUND});
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
 *      ArrayOfRevisionsCategory:
 *          type: array
 *          items:
 *              $ref: '#/components/schemas/RevisionCategory'
 */
/**
 * @swagger
 * components:
 *  responses:
 *      RevisionsCategoryFound:
 *           description: send back array of all revisions category
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/ArrayOfRevisionsCategory'
 */
module.exports.getAllCategories = async (req, res) => {
    try {
        const categoriesDB = await CategoryORM.findAll({order: [['difficulty_order', 'ASC']]});
        if (categoriesDB !== null) {
            const categories = [];
            for (const categoryDB of categoriesDB) {
                const {id, category_name, difficulty_order, description} = categoryDB;

                const category = {
                    id: id,
                    category_name: category_name,
                    difficulty_order: difficulty_order,
                    description: description
                };
                categories.push(category);
            }
            res.json(categories);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function categoryValid(category_name, difficulty_order, description) {
    if (description !== null) {
        return description.length <= 500;
    }
    return await CategoryORM.count() > 2 && await CategoryORM.count() < 5 &&
        category_name.length < 100;
}

/**
 * @swagger
 *  components:
 *      responses:
 *          RevisionCategoryAdd:
 *              description: The revision category has been  added to database
 *          IncorrectCategoryBody:
 *              description: At least one parameter in body is wrong or no parameter
 *      requestBodies:
 *          RevisionCategoryToAdd:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              category_name:
 *                                  type: string
 *                              difficulty_order:
 *                                  type: integer
 *                              description:
 *                                  type: string
 *                          required:
 *                              - id
 *                              - category_name
 *                              - difficulty_order
 *                              - description
 */
module.exports.postCategory = async (req, res) => {
    const body = req.body;
    const {category_name, difficulty_order, description} = body;
    try {
        await sequelize.transaction({
            deferrable: Sequelize.Deferrable.SET_DEFERRED
        }, async (t) => {
            if (await categoryValid(category_name, difficulty_order, description)) {
                await CategoryORM.create({
                    category_name : category_name,
                    difficulty_order : difficulty_order,
                    description : description},
                    {transaction: t});
                const categoriesDB = await CategoryORM.findAll({order: [['difficulty_order', 'ASC']]});
                let iOrder = 0;
                for (const category of categoriesDB) {
                    await CategoryORM.update({difficulty_order: iOrder}, {where: {id: category.id}, transaction : t});
                    iOrder++;
                }
                res.sendStatus(201);
            }
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

/**
 * @swagger
 *  components:
 *      responses:
 *          RevisionCategoryUpdated:
 *              description: The revision category has been updated
 *      requestBodies:
 *          RevisionCategoryToUpdate:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              category_name:
 *                                  type: string
 *                              difficulty_order:
 *                                  type: integer
 *                              description:
 *                                  type: string
 *                          required:
 *                              - id
 *                              - category_name
 *                              - difficulty_order
 *                              - description
 */
module.exports.updateCategory = async (req, res) => {
    const {category_id, category_name, difficulty_order, description} = req.body;
    try {
        if (category_id !== 1) {
            if (await categoryValid(category_name, difficulty_order, description)) {
                const categoryDB = await CategoryORM.findOne({where: {id: category_id}});
                const categoriesDB = await CategoryORM.findAll({order: [['difficulty_order', 'ASC']]});

                if (categoryDB !== null) {
                    await sequelize.transaction({
                        deferrable: Sequelize.Deferrable.SET_DEFERRED
                    }, async (t) => {
                        await CategoryORM.update({
                            category_name,
                            difficulty_order,
                            description
                        }, {where: {id: category_id}, transaction: t});

                        let iOrder = 0;
                        for (const category of categoriesDB) {
                            await CategoryORM.update({difficulty_order: iOrder}, {where: {id: category.id}, transaction: t});
                            iOrder++;
                        }
                        res.sendStatus(204);
                    });
                } else {
                    res.sendStatus(404).send({error: MSG_CATEGORY_NOT_FOUND});
                }
            } else {
                res.sendStatus(400).send({error: MSG_PARAMETER_WRONG});
            }
        } else {
            res.sendStatus(400).send({error: MSG_CANNOT_DELETE_CATEGORY});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function orderDifficulty() {
    const categoriesDB = await CategoryORM.findAll({order: [['difficulty_order', 'ASC']]});
    let iOrder = 0;
    for (const category of categoriesDB) {
        await CategoryORM.update({difficulty_order: iOrder}, {where: {id: category.id}});
        iOrder++;
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      RevisionCategoryDeleted:
 *          description: The revision category has been deleted
 */
module.exports.deleteCategory = async (req, res) => {
    const {id} = req.body;
    try {
        if (await CategoryORM.count() > 2) {
            if (id !== 1) {
                const categoryDB = await CategoryORM.findOne({where: {id: id}});
                if (categoryDB !== null) {
                    await sequelize.transaction({
                        deferrable: Sequelize.Deferrable.SET_DEFERRED
                    }, async (t) => {
                        await CardORM.update({category_id: 1}, {where: {category_id: id}, transaction: t});
                        await CategoryORM.destroy({where: {id: id}, transaction: t});
                    });

                    await orderDifficulty();

                    return res.sendStatus(204);
                } else {
                    res.sendStatus(404).send({error: MSG_CATEGORY_NOT_FOUND});
                }
            } else {
                return res.sendStatus(400).send({error: MSG_CANNOT_DELETE_CATEGORY});
            }
        } else {
            return res.sendStatus(400).send({error: "Il faut au moins 2 catégories"});
        }
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}