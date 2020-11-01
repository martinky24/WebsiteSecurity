var dbCon= require("./dbcon");
var faker = require('faker'); //https://github.com/marak/Faker.js/
var bcrypt = require('bcryptjs');

function resetTables(callback){
    var query = `TRUNCATE TABLE users, personal_info, financial_info, transaction_history RESTART IDENTITY`
    dbCon.runDBQuery(query,callback)
}

function fillTables(rowCount, callback){
    resetTables(()=>{
        passLength = faker.random.number({'min':5,'max':10})
        fillUser("admin","admin")
        fillFullUser("froglover420","ilovefrogs")
        for (let i = 0; i < rowCount; i++) {
            fillFullUser(faker.internet.password(passLength), faker.internet.userName())
        }
        setTimeout(callback, 2000);
    });
}

function fillUser(pass,username,callback){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pass, salt);
    var query = `INSERT INTO users VALUES (DEFAULT,'${pass}','${username}','${hash}') RETURNING user_id`
    dbCon.runDBQuery(query,callback);
}

function fillPersonalInfo(userID,first,last,birth,email){
    var query = `INSERT INTO personal_info VALUES (DEFAULT,'${first}','${last}','${birth}','${email}',${userID})`
    dbCon.runDBQuery(query)
}

function fillFinancialInfo(userID,routeNum,accountNum,balance){
    var query = `INSERT INTO financial_info VALUES (DEFAULT,${userID},${routeNum},${accountNum},${balance})`
    dbCon.runDBQuery(query)
}

function fillFullUser(pass,username){
    fillUser(pass,username,(qResult)=>{
        console.log(qResult.rows[0].user_id);
        if(dbCon.hasQueryResult(qResult) && qResult.rows[0].user_id){
            userID = qResult.rows[0].user_id;
            var fName = faker.name.firstName().replace("'","");
            var lName = faker.name.lastName().replace("'","");
            fillPersonalInfo(
                userID, fName,
                lName, faker.date.past(55,"1/1/2000").toLocaleDateString("en-US"),
                faker.internet.email(fName,lName)
            );
            fillFinancialInfo(
                userID, faker.finance.routingNumber(),
                faker.finance.account(), faker.finance.amount()
            );
        }
    });
}
// To init the tables, we can add to a like /resettables(x) route
// fillTables(5, function() { return undefined; })

exports.fillTables = fillTables;