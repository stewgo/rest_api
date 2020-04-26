const mariadb = require('mariadb');
const crypto = require('crypto');
const getConnection = require('../utils/getConnection');
const bcrypt = require('bcrypt');

const TOKEN_EXPIRY_IN_MINUTES = 30;

class LoginService {
    async doLogin(username, password) {
        try {
            this.connection = await getConnection();
            const user = await this.getUser(username, password);
        
            if (user) {
                return { 
                    token: await this.createToken(user.id),
                    user
                };
            } else {
                throw new Error('Incorrect username or password');
            }
        } finally {
            if (this.connection) this.connection.end();
        }
    }

    async createToken(userId) {
        const token = crypto.randomBytes(24).toString('base64');
        const expiry = new Date(Date.now() + TOKEN_EXPIRY_IN_MINUTES * 60000).getTime() / 1000;

        await this.connection.query(`
            insert into accessTokens (userId, token, expiry)
            VALUES (?, ?, FROM_UNIXTIME(?))`,
            [ userId, token, expiry]
        );
        
        return token;
    }

    async getUser(username, password) {
        const rows = await this.connection.query(
            `select id, username, password, email, name, isMerchant, phoneNumber, address, pickupInfo
            from users
            where username = ? or email = ?;`,
            [username, username]
        );
        const user = rows[0];

        if (!user) {
            return null;
        }

        const result = await bcrypt.compare(password, user.password);

        if (result) {
            delete user.password;
            return user;
        } else {
            return null;
        }
    }
}

module.exports = LoginService;