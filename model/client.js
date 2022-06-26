module.exports.getClient = async (user, pseudo) => {
    return await user.query(`
        SELECT *
        FROM "user"
        WHERE is_admin = false
          AND pseudo = $1;
    `, [pseudo]);
}

