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

module.exports = {
    deposit,
    getDepositInfo,
    getAccountInfo
}