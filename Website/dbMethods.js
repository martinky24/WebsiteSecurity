var dbCon= require("./dbcon");

function deposit(amount, userid, callback){
    var query = `UPDATE financial_info SET balance = balance + ${amount} WHERE user_id=${userid}`
    dbCon.runDBQuery(query,callback);
}
function getDepositInfo(userid, callback){
    var query = `SELECT balance, account_number FROM financial_info WHERE user_id=${userid}`
    dbCon.runDBQuery(query,callback);
}
module.exports = {deposit,getDepositInfo}