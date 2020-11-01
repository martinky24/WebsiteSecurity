const db = require("./dbcon");
let faker = require('faker'); //https://github.com/marak/Faker.js/
let bcrypt = require('bcryptjs');

// Withdrawal money from a given account and user id
async function withdrawal(userid, account, amount) {
    // get client connection
    const client = await db.pool.connect();

    // begin transaction
    try {
        await client.query("BEGIN");
        const query = `SELECT balance FROM financial_info WHERE user_id=${userid}`;
        const res = await client.query(query);

        // check balance amount
        if (res.rows[0].balance >= amount) {

            // Subtract account balance from user account
            const update_query = `UPDATE financial_info SET balance = balance - ${amount} WHERE user_id=${userid} AND account_number=${account}`;
            const update_res = await client.query(update_query);

            if (update_res.rowCount == 1) {
                await client.query("COMMIT");
                return {"Success":"Money Successfully Withdrawn!"};
            } 
            else {                
                throw {"Error":"Unable to withdrawl amount, see console."};
            }
        }
        else {
            throw {"Error":"Invalid Account Balance"};    
        }
    } catch(err) {
        // Rollback transaction
        await client.query("ROLLBACK");

        // Pass error message to controller
        if (err.Error) {
            return err;
        }
        else {
            return {"Error": "Database Error, see console."};
        }
    } finally {
        client.release();
    }
}


// Transfer account values
async function transfer(userid, fromAccount, toAccount, amount) {

    // get client connection
    const client = await db.pool.connect();
    try {
        // start transaction
        await client.query("BEGIN");

        // basic checks
        if (amount < 0) {
            throw {"Error":"Can only transfer a positive amount"};
        }
        if (fromAccount == toAccount){
            throw {"Error":"Cannot transfer to self"}
        }
        // get current account values
        let balance_query = `SELECT balance FROM financial_info WHERE user_id=${userid} AND account_number=${fromAccount}`;
        const balance_res = await client.query(balance_query);

        // check account value is greater than amount
        if (balance_res.rows[0].balance >= amount) {
    
            // check that second account exists
            let account_query = `SELECT COUNT(1) FROM financial_info WHERE account_number=${toAccount}`;
            const account_res = await client.query(account_query);

            // account exists
            if (account_res.rows[0].count == 1) {

                // transfer amount to separate account
                let transferTo_query = `UPDATE financial_info SET balance = balance + ${amount} WHERE account_number=${toAccount};`
                let transferFrom_query = `UPDATE financial_info SET balance = balance - ${amount} WHERE account_number=${fromAccount};`

                const transferTo_res = await client.query(transferTo_query);
                const transferFrom_res = await client.query(transferFrom_query);

                if (transferTo_res.rowCount == 1 && transferFrom_res.rowCount == 1) {
                    await client.query("COMMIT");
                    return {"Success":"Money successfully transferred"};
                }
                else {
                    throw {"Error":"Error transferring money, see IT"};
                }                  
            }
            else {
                throw {"Error":"The account you are transferring to does not exist"};
            }      
        }
        else {
            throw {"Error":"Not enough money in account to transfer"};
        } 
    }
    catch(err) {
        // Rollback transaction
        await client.query("ROLLBACK");

        // Pass error message to controller
        if (err.Error) {
            return err;
        }
        else {
            return {"Error": "Database Error, see console."};
        }
    }
    finally {
        client.release();
    }
}

// Deposit money from a given account and user id
async function deposit(userid, account, amount) {
    // get client connection
    const client = await db.pool.connect();

    // begin transaction
    try {
        await client.query("BEGIN");
        // Add amount to user account balance
        const update_query = `UPDATE financial_info SET balance = balance + ${amount} WHERE user_id=${userid} AND account_number=${account}`;
        const update_res = await client.query(update_query);

        if (update_res.rowCount == 1) {
            await client.query("COMMIT");
            return {"Success":"Money Successfully Deposited!"};
        } 
        else {                
            throw {"Error":"Unable to deposit amount, see console."};
        }
    } catch(err) {
        // Rollback transaction
        await client.query("ROLLBACK");

        // Pass error message to controller
        if (err.Error) {
            return err;
        }
        else {
            return {"Error": "Database Error, see console."};
        }
    } finally {
        client.release();
    }
}
// Get balance, account number, and routing number based on user id
async function getUserInfo(userid) {
    // get client connection
    const client = await db.pool.connect();
    // get account info
    const select_query = `SELECT balance, routing_number, account_number FROM financial_info WHERE user_id=${userid}`;
    var select_res = await client.query(select_query);

    client.release();
    return select_res;
}

// Get all users' financial info  
async function getAllFinancialInfo(){
    // get client connection
    const client = await db.pool.connect();

    const select_query = `SELECT * FROM financial_info`;
    var select_res = await client.query(select_query);

    client.release();
    return select_res;
}

async function checkValidUsername(username){
    // get client connection
    const client = await db.pool.connect();

    const select_query = `SELECT TRUE as exists, user_id, password_hash FROM users WHERE username = '${username}' LIMIT 1 `
    var select_res = await client.query(select_query);

    client.release();
    return select_res;
}

async function createUser(user, pass){
    // get client connection
    const client = await db.pool.connect();

    // begin transaction
    try {
        await client.query("BEGIN");
        // Create hashed pass
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(pass, salt);
        const insert_query = `INSERT INTO users (username, password, password_hash) VALUES ('${user}', '${pass}', '${hash}') RETURNING user_id`;
        // Try to insert new user
        const insert_res = await client.query(insert_query);

        // Return new user's id
        if (insert_res.rowCount == 1) {
            await client.query("COMMIT");
            return insert_res;
        } 
        else {                
            throw {"Error":"User creation unsuccessful"};
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

async function createUserInfo(first, last, bday, email, uid){
    // get client connection
    const client = await db.pool.connect();

    // begin transaction
    try {
        await client.query("BEGIN");
        
        const routing = faker.finance.routingNumber();
        const account = faker.finance.account();
        let insert_query = `INSERT INTO personal_info (first_name, last_name, birth_date, email, user_id) VALUES ('${first}', '${last}', '${bday}', '${email}', '${uid}');`;
        insert_query += `INSERT INTO financial_info (user_id, routing_number, account_number, balance) VALUES ('${uid}', '${routing}', '${account}', 0.);`;
        
        // Try to insert new user info
        const insert_res = await client.query(insert_query);

        if (insert_res) {
            await client.query("COMMIT");
            return {"Success":"New user successfully created"};
        } 
        else {                
            throw {"Error":"User creation unsuccessful"};
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

async function getAccountInfo(userid){
    // get client connection
    const client = await db.pool.connect();

    const select_query = `SELECT * FROM personal_info INNER JOIN financial_info ON personal_info.user_id = financial_info.user_id where personal_info.user_id = '${userid}'`;
    var select_res = await client.query(select_query);

    client.release();
    return select_res;
}

module.exports = {
    withdrawal,
    transfer,
    deposit, 
    getAllFinancialInfo,
    getUserInfo,
    getAccountInfo,
    checkValidUsername,
    createUser,
    createUserInfo,
    
}