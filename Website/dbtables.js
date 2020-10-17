var dbCon= require("./dbcon");
var faker = require('faker'); //https://github.com/marak/Faker.js/

function resetTables(callback){
    var query = `TRUNCATE TABLE users, personal_info, financial_info, transaction_history RESTART IDENTITY`
    dbCon.runDBQuery(query,callback)
}
function fillTables(rowCount){
    resetTables(()=>{
        for (let i = 0; i < rowCount; i++) {
            fillUser()
        }
    });
}
function fillUser(){
    var passLength = faker.random.number({'min':5,'max':50})
    var query = `INSERT INTO users VALUES (DEFAULT,'${faker.internet.password(passLength)}','${faker.internet.userName()}','${faker.internet.password(passLength)}') RETURNING user_id`
    dbCon.runDBQuery(query,(res)=>{
        console.log(res.rows[0].user_id);
        if(res && res.rows && res.rows.length > 0 && res.rows[0].user_id){
            userID = res.rows[0].user_id;
            fillPersonalInfo(userID);
            fillFinancialInfo(userID);
        }
    });
}
function fillPersonalInfo(userID){
    var fName = faker.name.firstName().replace("'","");
    var lName = faker.name.lastName().replace("'","");
    var query = `INSERT INTO personal_info VALUES (DEFAULT,'${fName}','${lName}','${faker.date.past(55,"1/1/2000").toLocaleDateString("en-US")}','${faker.internet.email(fName,lName)}',${userID})`
    dbCon.runDBQuery(query)
}
function fillFinancialInfo(userID){
    var query = `INSERT INTO financial_info VALUES (DEFAULT,${userID},${faker.finance.routingNumber()},${faker.finance.routingNumber()},${faker.finance.amount()})`
    dbCon.runDBQuery(query)
}
// To init the tables, we can add to a like /resettables(x) route
// fillTables(5)