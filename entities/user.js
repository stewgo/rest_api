const _ = require('underscore');

class User {
    constructor(json) {
        this.json = json;
    }

    toResource() {
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