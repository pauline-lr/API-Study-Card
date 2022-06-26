const CardRouter = require("./card");
const DeckRouter = require("./deck");
const CategoryRouter = require("./revisionCategory");
const SessionRouter = require("./session");
const ClientRouter = require("./client");

const router = require("express").Router();


router.use("/v1/card", CardRouter);
router.use("/v1/deck", DeckRouter);
router.use("/v1/category", CategoryRouter);
router.use("/v1/session", SessionRouter);
router.use("/v1/client", ClientRouter);

router.use("/", (req, res) => res.sendStatus(201));

module.exports = router;