var dbCon= require("./dbcon");

function deposit(amount, userid, callback){
    var query = `UPDATE financial_info SET balance = balance + ${amount} WHERE user_id=${userid}`
    dbCon.runDBQuery(query,callback);
}
module.exports = {deposit}