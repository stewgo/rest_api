const mariadb = require('mariadb');
const getConnection = require('../utils/getConnection');

class OrderService {
    async placeOrder(userId, productId) {
        let conn;

        try {
            conn = await getConnection();
            const now = new Date(Date.now()).getTime() / 1000;

            await conn.query(`
                INSERT into orders (productId, purchaserId, date)
                VALUES (?, ?, FROM_UNIXTIME(?));`,
                [ productId, userId, now]
            );

            const rows = await conn.query('SELECT LAST_INSERT_ID() as orderId;');

            return rows[0].orderId;

        } finally {
            if (conn) conn.end();
        }
    }
}

module.exports = OrderService;