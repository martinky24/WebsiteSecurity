var dbCon= require("./dbcon");

// Deposit amount into account based on user id
function deposit(amount, userid, callback){
    var query = `UPDATE financial_info SET balance = balance + ${amount} WHERE user_id=${userid}`;
    dbCon.runDBQuery(query,callback);
}

// Get balance and account number based on user id
function getDepositInfo(userid, callback){
    var query = `SELECT balance, account_number FROM financial_info WHERE user_id=${userid}`;
    dbCon.runDBQuery(query,callback);
}

// Get balance, account number, and routing number based on user id
function getAccountInfo(userid, callback) {
    let query = `SELECT balance, routing_number, account_number FROM financial_info WHERE user_id=${userid}`;
    dbCon.runDBQuery(query, callback);
}

// Transfer account values
function transfer(userid, fromAccount, toAccount, amount, callback) {
    // get current account values
    let query = `SELECT balance FROM financial_info WHERE user_id=${userid} AND account_number=${fromAccount}`;
    dbCon.runDBQuery(query, (res) => {
        //console.log(res);
        // check account value is greater than amount
        if (res.rows[0].balance >= amount) {
            
            // check that second account exists
            query = `SELECT COUNT(1) FROM financial_info WHERE account_number=${toAccount}`;
            dbCon.runDBQuery(query, (res) => {
                //console.log(res);

                // account exists
                if (res.rows[0].count == 1) {

                    // transfer amount to separate account
                    query = `UPDATE financial_info SET balance = balance + ${amount} WHERE account_number=${toAccount};` +
                            `UPDATE financial_info SET balance = balance - ${amount} WHERE account_number=${fromAccount};`
                    
                    dbCon.runDBQuery(query, (res) => {
                        //console.log(res);
                        // check that tables were updated
                        if (res[0].rowCount == 1 && res[1].rowCount == 1) {
                            callback({"Success":"Money successfully transferred"});
                        }
                        else {
                            callback({"Error":"Error transferring money, see IT"});
                        }                        
                    })                    
                }
                else {
                    callback({"Error":"Transfer to account does not exist"});
                }            
            })
        }
        else {
            callback({"Error":"Not enough money in account to transfer"});
        }        
    })
}

module.exports = {
    deposit,
    getDepositInfo,
    getAccountInfo,
    transfer
}