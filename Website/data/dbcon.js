const { Pool } = require("pg");

// Create connection pool
const pool = new Pool({
    user: process.env.DBUSER,
    host: 'team-web-security.cni5jxwbesmd.us-west-1.rds.amazonaws.com',
    database: 'banking',
    password: process.env.DBPASS,
    port: 5422
})

module.exports = {
    pool
}


