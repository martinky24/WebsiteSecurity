const db = require("./dbcon");
let faker = require('faker'); //https://github.com/marak/Faker.js/
let bcrypt = require('bcryptjs');

async function resetTables(){
    // get client connection
    const client = await db.pool.connect();

    // begin transaction
    try {
        await client.query("BEGIN");
        const query = `TRUNCATE TABLE users, personal_info, financial_info, transaction_history RESTART IDENTITY`;

        const result = await client.query(query);

        if (result) {
            await client.query("COMMIT");
            return result;
        } 
        else {                
            throw "Error during truncation";
        }
    } catch(err) {
        // Rollback transaction
        await client.query("ROLLBACK");

        // Pass error message to promise catch
        throw err
    } finally {
        client.release();
    }

}

async function fillTables(rowCount){
    await resetTables().then(async function(){
        let promises = []
        passLength = faker.random.number({'min':5,'max':10})

        promises.push(fillUser("admin","admin"),fillFullUser("ilovefrogs", "froglover420"))
        console.log("Creating dynamic users")
        for (let i = 0; i < rowCount; i++) {
            promises.push(fillFullUser(faker.internet.password(passLength), faker.internet.userName()))
        }
        await Promise.all(promises).then(()=>{
            console.log("Finished creating all users")
        }).catch(err=>{
            console.log(err);
        });
    }).catch((err)=>{
        console.log(err)
    })
}

async function fillUser(pass,username){
    // get client connection
    const client = await db.pool.connect();

    // begin transaction
    try {
        await client.query("BEGIN");
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(pass, salt);
        const query = `INSERT INTO users VALUES (DEFAULT,'${pass}','${username}','${hash}') RETURNING user_id`

        const result = await client.query(query);

        if (result.rowCount == 1) {
            await client.query("COMMIT");
            return result;
        } 
        else {         
            throw "Error during filluser()";
        }
    } catch(err) {
        // Rollback transaction
        await client.query("ROLLBACK");

        // Pass error message to promise catch
        throw err
    } finally {
        client.release();
    }
}

async function fillPersonalInfo(userID,first,last,birth,email){
    // get client connection
    const client = await db.pool.connect();

    // begin transaction
    try {
        await client.query("BEGIN");
        const query = `INSERT INTO personal_info VALUES (DEFAULT,'${first}','${last}','${birth}','${email}',${userID})`

        const result = await client.query(query);

        if (result) {
            await client.query("COMMIT");
            return result;
        } 
        else {                
            throw "Error during fillPersonalInfo()";
        }
    } catch(err) {
        // Rollback transaction
        await client.query("ROLLBACK");

        // Pass error message to promise catch
        throw err
    } finally {
        client.release();
    }
}

async function fillFinancialInfo(userID,routeNum,accountNum,balance){
    // get client connection
    const client = await db.pool.connect();

    // begin transaction
    try {
        await client.query("BEGIN");
        const query = `INSERT INTO financial_info VALUES (DEFAULT,${userID},${routeNum},${accountNum},${balance})`

        const result = await client.query(query);

        if (result) {
            await client.query("COMMIT");
            return result;
        } 
        else {                
            throw "Error during fillFinancialInfo()";
        }
    } catch(err) {
        // Rollback transaction
        await client.query("ROLLBACK");

        // Pass error message to promise catch
        throw err
    } finally {
        client.release();
    }
}

async function fillFullUser(pass,username){
    await fillUser(pass,username).then(async function(userRes){
        console.log(userRes.rows[0].user_id);
        let promises = []
        
        if(userRes.rows.length > 0 && userRes.rows[0].user_id){
            userID = userRes.rows[0].user_id;
            var fName = faker.name.firstName().replace("'","");
            var lName = faker.name.lastName().replace("'","");
            pInfoPromise = fillPersonalInfo(
                userID, fName,
                lName, faker.date.past(55,"1/1/2000").toLocaleDateString("en-US"),
                faker.internet.email(fName,lName)
            );
            fInfoPromise = fillFinancialInfo(
                userID, faker.finance.routingNumber(),
                faker.finance.account(), faker.finance.amount()
            );
            promises.push(pInfoPromise,fInfoPromise)
            await Promise.all(promises).catch(err=>{
                console.log(err);
            });
            
        }
    });
    
}
//fillTables(5).then(()=>{console.log("do stuff with res")});
exports.fillTables = fillTables;