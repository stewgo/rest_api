const _ = require('underscore');
const BaseEntity = require('../entities/baseEntity');

class Order extends BaseEntity {
    serialize() {
        const attributes = _.omit(this.json, ['id', 'productId', 'purchaserId']);
        const json = this.json;

        return {
            type: 'orders',
            id: json.id,
            attributes,
            relationships: {
                product: {
                    data: {
                        type: 'products',
                        id: json.productId
                    }
                },
                purchaser: {
                    data: {
                        type: 'users',
                        id: json.purchaserId
                    }
                }
            }
        };
    }
}

module.exports = Order;