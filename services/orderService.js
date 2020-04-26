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
            const orderId = rows[0].orderId;
            const order = await this._getOrderDetails(orderId, conn);

            return {
                id: order.id,
                date: order.date,
                purchaserId: order.purchaserId,
                product: {
                    id: order.productId,
                    name: order.productName,
                    image: order.image,
                    description: order.description,
                    price: order.price,
                    availableDate: order.availableDate
                },
                merchant: {
                    id: order.merchantId,
                    username: order.username,
                    name: order.merchantName,
                    email: order.email,
                    phoneNumber: order.phoneNumber,
                    address: order.address,
                    pickupInfo: order.pickupInfo
                }
            };
        } finally {
            if (conn) conn.end();
        }
    }


    async _getOrderDetails(orderId, conn) {
        const rows = await conn.query(`
            SELECT u.id as merchantId, u.username, u.name as merchantName, u.email, u.phoneNumber, u.address, u.pickupInfo, 
                o.id, o.date, o.purchaserId, p.name as productName, p.image, p.description, p.price, p.id as productId, p.availableDate
            FROM users u INNER JOIN products p ON (u.id = p.merchantId) INNER JOIN orders o ON (o.productId = p.id)
            WHERE o.id = ?;`,
            [orderId]
        );

        if (rows.length) {
            return rows[0];
        } else {
            return null;
        }
    }
}

module.exports = OrderService;