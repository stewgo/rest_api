const fs = require('fs');

function getConfig() {
    return JSON.parse(fs.readFileSync('config/config.json'));
}

module.exports = getConfig;