const mariadb = require('mariadb');
const crypto = require('crypto');
const getConnection = require('../utils/getConnection');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

class SignupService {
    // User contains: username, password, name, email, phoneNumber, address
    async signup(user) {
        let conn;
        const { username, email, name, phoneNumber, address } = user;
        const password = await bcrypt.hash(user.password, SALT_ROUNDS)

        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT id from users
                WHERE username = ? or email = ?;`,
                [username, email]
            );

            if (rows.length) {
                throw new Error('A user with that username or email already exists.');
            }

            await conn.query(
                `
                INSERT into users (username, password, name, email, phoneNumber, address, isMerchant)
                VALUES (?, ?, ?, ?, ?, ?, false);
                `,
                [ username, password, name, email, phoneNumber, address ]
            )

        } finally {
            if (conn) conn.end();
        }
    }
}

module.exports = SignupService;