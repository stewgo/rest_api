const _ = require('underscore');
const BaseEntity = require('../entities/baseEntity');

class Product extends BaseEntity {
    serialize() {
        const attributes = _.omit(this.json, ['id', 'merchantId']);
        const json = this.json;

        return {
            type: 'products',
            id: json.id,
            attributes,
            relationships: {
                merchant: {
                    data: {
                        type: 'users',
                        id: json.merchantId
                    }
                }
            }
        };
    }

    static deserialize(resource) {
        const json = {
            id: resource.id,
            ...resource.attributes,
            merchantId: resource.relationships.merchant.data.id
        };

        return new Product(json);
    }
}

module.exports = Product;