const mariadb = require('mariadb');
const getConnection = require('../utils/getConnection');

class UserService {
    async getUserByToken(token) {
        let conn;
        try {
            conn = await getConnection();
            const now = new Date(Date.now()).getTime() / 1000;

            const rows = await conn.query(`
                SELECT u.id, u.username, u.name, u.email, u.phoneNumber, u.address, u.isMerchant, u.pickupInfo
                FROM accessTokens at INNER JOIN users u ON (at.userId = u.id)
                WHERE at.token = ? AND at.expiry > FROM_UNIXTIME(?) `,
                [token, now]
            );

            if (rows.length) {
                return rows[0];
            }

        } finally {
            if (conn) conn.end();
        }
    }
}

module.exports = UserService;