module.exports.getAdmin = async (user, pseudo) => {
    return await user.query(`
        SELECT *
        FROM "user"
        WHERE is_admin = true
          AND pseudo = $1;
    `, [pseudo]);
}

