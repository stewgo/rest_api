const _ = require('underscore');
const BaseEntity = require('../entities/baseEntity');

class User extends BaseEntity {
    serialize() {
        const attributes = _.omit(this.json, ['id']);
        const json = this.json;

        return {
            type: 'users',
            id: json.id,
            attributes
        };
    }
}

module.exports = User;