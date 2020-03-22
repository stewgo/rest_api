const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost', 
    user: 'root', 
    password: 'root',
    connectionLimit: 5,
    database: 'stewgo'
});

async function getConnection() {
    return await pool.getConnection();
}

module.exports = getConnection;