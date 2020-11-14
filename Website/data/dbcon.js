const { Pool } = require("pg");

// Create connection pool
// General Connection
// Only allows selects, inserts, updates -> cannot create schemas
const pool = new Pool({
    user: process.env.DBUSER,
    host: 'team-web-security.cni5jxwbesmd.us-west-1.rds.amazonaws.com',
    database: 'banking',
    password: process.env.DBPASS,
    port: 5422
})
// Admin Connection
// Only allows selects, inserts, updates, truncates -> cannot create schemas
const adminPool = new Pool({
    user: process.env.DBADMINUSER,
    host: 'team-web-security.cni5jxwbesmd.us-west-1.rds.amazonaws.com',
    database: 'banking',
    password: process.env.DBADMINPASS,
    port: 5422
})
module.exports = {
    pool,
    adminPool
}


