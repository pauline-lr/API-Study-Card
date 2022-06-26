const {getAdmin} = require('./admin');
const {getClient} = require('./client');
const {compareHash, getHash} = require('../utils/utils');


module.exports.postClient = async (client, pseudo, password, email, is_admin) => {
    return await client.query(`
        INSERT INTO "client" (pseudo, password, email, is_admin)
        VALUES ($1, $2, $3, $4)`, [pseudo, await getHash(password), email, is_admin]
    );
};


module.exports.getClient = async (client, pseudo, password) => {
    const promises = [];
    const promiseClient = getClient(client, pseudo);
    const promiseAdmin = getAdmin(client, pseudo);

    promises.push(promiseClient, promiseAdmin);

    const values = await Promise.all(promises);

    const clientRow = values[0].rows[0];
    const adminRow = values[1].rows[0]

    if (clientRow !== undefined && await compareHash(password, clientRow.password)) {
        return {
            clientType: "client", value: clientRow
        };
    } else if (adminRow !== undefined && await compareHash(password, adminRow.password)) {
        return {
            clientType: "admin", value: adminRow
        };
    } else {
        return {clientType: "unknown", value: null};
    }
};


module.exports.updateClient = async (client, id, pseudo, password, email, is_admin) => {
    const params = [];
    let query = `UPDATE "client" SET`;
    const querySet = [];
    if (pseudo !== undefined) {
        params.push(pseudo);
        querySet.push(` pseudo = $${params.length} `);
    }
    if (password !== undefined) {
        params.push(await getHash(password));
        querySet.push(` password = $${params.length} `);
    }
    if (email !== undefined) {
        params.push(email);
        querySet.push(` email = $${params.length} `);
    }
    if (is_admin !== undefined) {
        params.push(is_admin);
        querySet.push(` is_admin = $${params.length} `);
    }

    if (params.length > 0) {
        query += querySet.join(',');
        params.push(id);
        query += ` WHERE id = $${params.length}`;

        return client.query(query, params);
    } else {
        throw new Error("No field to update");
    }
};



