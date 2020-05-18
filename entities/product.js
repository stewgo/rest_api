const _ = require('underscore');

class Product {
    constructor(json) {
        this.json = json;
    }

    toResource() {
        const attributes = _.omit(this.json, ['id', 'merchantId']);
        const json = this.json;

        return {
            type: 'products',
            id: json.id,
            attributes,
            relationships: {
                merchants: {
                    data: {
                        type: 'users',
                        id: json.merchantId
                    }
                }
            }
        };
    }
}

module.exports = Product;