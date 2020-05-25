const _ = require('underscore');

class BaseEntity {
    constructor(json) {
        this.json = json;
    }

    get(attribute) {
        return this.json[attribute];
    }

    getJson() {
        return this.json;
    }

    serialize() {
        throw new Error('Please implement the serialize() method');
    }
}

module.exports = BaseEntity;