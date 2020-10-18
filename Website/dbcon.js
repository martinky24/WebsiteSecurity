/* Database setup */ 
const { Client } = require('pg');

function getClient(){
    return new Client({
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        host: 'team-web-security.cni5jxwbesmd.us-west-1.rds.amazonaws.com',
        database: 'banking',
        port: 5422,
    }); // can only connect and end connection once
}
function runQuery(query,callback){
    var client = getClient()
    client.connect(err => {
        if (err) {
          console.error("connection:",client,'connection error', err.stack)
        } else {
          client.query(query, (err, res) => {
            client.end()
            console.log(`Result of the query ${query}:\n`,"Errors:",err,"\nResults:",res)
            if(callback){
                callback(res)
            }
          });
        }
      })
}
exports.getDbClient = getClient;
exports.runDBQuery = runQuery; // mainly just use this to take care of connection handling
