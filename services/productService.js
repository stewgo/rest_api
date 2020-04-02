const mariadb = require('mariadb');
const getConnection = require('../utils/getConnection');

class ProductService {
    async getAllProducts() {
        let conn;

        try {
            conn = await getConnection();

            return await conn.query(`
                select p.id as id, p.name as productName, u.name as merchantName, price, availableDate, description
                from products p inner join users u on (p.merchantId = u.id); `
            );

        } finally {
            if (conn) conn.end();
        }
    }

    async getProductsByMerchantId(merchantId) {
        let conn;

        try {
            conn = await getConnection();

            return await conn.query(`
                select products.id as id, products.name as productName, price, availableDate, description
                from products where products.merchantId = ?; `,
                [ merchantId ]
            );

        } finally {
            if (conn) conn.end();
        }
    }

    async createProduct(product) {
        const { name, price, availableDate, description, merchantId, image = '' } = product;
        let conn;

        try {
            conn = await getConnection();

            await conn.query(`
                INSERT into products (name, price, availableDate, description, merchantId, image)
                VALUES (?, ?, ?, ?, ?, ?);`,
                [ name, price, availableDate, description, merchantId, image]
            );

            const rows = await conn.query('SELECT LAST_INSERT_ID() as id;');

            return rows[0].id;

        } finally {
            if (conn) conn.end();
        }
    }
}

module.exports = ProductService;