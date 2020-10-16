/* Database setup */ 
const { Client } = require('pg');

const client = new Client({
    user: 'coreuser',
    host: 'team-web-security.cni5jxwbesmd.us-west-1.rds.amazonaws.com',
    database: 'postgres',
    password: 'corepass',
    port: 5422,
});

client.connect();

client.query('SELECT NOW()', (err, res) => {
    console.log(err, res.rows)
    client.end()
});