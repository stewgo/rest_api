const mariadb = require('mariadb');
const getConnection = require('../utils/getConnection');
const Order = require('../entities/order');

class OrderService {
    async addOrder(userId, productId) {
        let conn;

        try {
            conn = await getConnection();
            const now = new Date(Date.now());
            const nowTime = now.getTime() / 1000;

            await conn.query(`
                INSERT into orders (productId, purchaserId, date)
                VALUES (?, ?, FROM_UNIXTIME(?));`,
                [ productId, userId, nowTime ]
            );

            const rows = await conn.query('SELECT LAST_INSERT_ID() as orderId;');
            const orderId = rows[0].orderId;

            return new Order({
                id: orderId,
                date: now.toISOString(),
                purchaserId: userId,
                productId
            });
        } finally {
            if (conn) conn.end();
        }
    }

    async getOrder(id) {
        let conn;

        try {
            conn = await getConnection();

            const result = await conn.query(`
                SELECT id, productId, purchaserId, date from orders WHERE id = ?; `,
                [ id ]
            );

            if (result.length) {
                return new Order(result[0]);
            } else {
                return null;
            }
        } finally {
            if (conn) conn.end();
        }
    }
}

module.exports = OrderService;