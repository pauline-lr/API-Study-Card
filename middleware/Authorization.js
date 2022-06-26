/**
 *@swagger
 * components:
 *  responses:
 *      mustBeAdmin:
 *          description: The requested action can only be performed by an administrator
 */
module.exports.mustBeAdmin = (req, res, next) => {
    if (req.session && req.session.authLevel === "admin") {
        next();
    } else {
        res.sendStatus(403);
    }
}

/**
 *@swagger
 * components:
 *  responses:
 *      mustBeClientOrAdmin:
 *          description: The requested action can only be performed by a client or an administrator
 */
module.exports.mustBeClientOrAdmin = (req, res, next) => {
    if (req.session && (req.session.authLevel === "client" || req.session.authLevel === "admin")) {
        next();
    } else {
        res.sendStatus(403);
    }
}


/**
 *@swagger
 * components:
 *  responses:
 *      isMyAccountOrAdmin:
 *          description: The requested action can only be performed by the owner of this account or an admin
 */
module.exports.isMyAccountOrAdmin = (req, res, next) => {
    if (req.session &&
        (req.session.authLevel === "admin" ||
            (req.params.pseudo && req.session.pseudo === req.params.pseudo))) {
        next();
    } else {
        res.sendStatus(403).send({error: "It's not your account"});
    }
}