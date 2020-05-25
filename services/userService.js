const mariadb = require('mariadb');
const getConnection = require('../utils/getConnection');
const User = require('../entities/user');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;
const crypto = require('crypto')

class UserService {
    async getUserByToken(token) {
        let conn;
        try {
            conn = await getConnection();
            const now = new Date(Date.now()).getTime() / 1000;

            const rows = await conn.query(`
                SELECT u.id, u.username, u.name, u.email, u.phoneNumber, u.address, u.isMerchant, u.pickupInfo
                FROM accessTokens at INNER JOIN users u ON (at.userId = u.id)
                WHERE at.token = ? AND at.expiry > FROM_UNIXTIME(?) `,
                [token, now]
            );

            if (rows.length) {
                return new User(rows[0]);
            }

        } finally {
            if (conn) conn.end();
        }
    }

    async getUsersByIds(userIds) {
        let conn;
        try {
            conn = await getConnection();

            const results = await conn.query(`
                SELECT u.id, u.username, u.name, u.email, u.phoneNumber, u.address, u.isMerchant, u.pickupInfo
                FROM users u
                WHERE ID IN ?`,
                [userIds]
            );

            return results.map(row => new User(row));
        } finally {
            if (conn) conn.end();
        }
    }

    async addUser(user) {
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

module.exports = UserService;