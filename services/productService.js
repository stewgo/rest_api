const mariadb = require('mariadb');
const getConnection = require('../utils/getConnection');
const QueryBuilder = require('../utils/queryBuilder');
const Product = require('../entities/product');
const _ = require('underscore');

class ProductService {
    // https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#connectionquerysql-values---promise
    async getProducts(options) {
        let conn;

        try {
            conn = await getConnection();
            let params = [];
            const selectFragments = [];
            const whereFragments = [];

            selectFragments.push(`
                p.id as id, p.name as name, p.merchantId as merchantId, price, availableDate, description, image
                from products p
            `);

            if (_.isNumber(options.merchantId)) {
                whereFragments.push('p.merchantId = ?');
                params.push(options.merchantId);
            }

            if (_.isNumber(options.productId)) {
                whereFragments.push('p.id = ?');
                params.push(options.productId);
            }

            if (options.availableOnly) {
                selectFragments.push('left outer join orders o on (o.productId = p.id)');
                whereFragments.push('o.id is null AND p.availableDate > current_timestamp()');
            }

            // I'm not sure if using this QueryBuilder is the best approach
            const query = QueryBuilder.build({
                select: selectFragments,
                where: whereFragments
            });
            const result = await conn.query(query, params);

            return result.map(json => new Product(json));

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