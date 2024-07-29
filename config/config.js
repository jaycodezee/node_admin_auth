const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    development: {
        username: process.env.user,
        password: process.env.password,
        database: process.env.database,
        host: process.env.host,
        dialect: "postgres",
    },
    test: {
        username: process.env.user,
        password: process.env.password,
        database: process.env.database,
        host: process.env.host,
        dialect: "postgres"
    },
    production: {
        username: process.env.user,
        password: process.env.password,
        database: process.env.database,
        host: process.env.host,
        dialect: "postgres"
    }
}