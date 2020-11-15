const db = require("./dbcon");
let faker = require('faker'); //https://github.com/marak/Faker.js/
let bcrypt = require('bcryptjs');
let fs = require('fs');

// Withdrawal money from a given account and user id
async function withdrawal(userid, account, amount, secure) {
    // get client connection
    const client = await db.pool.connect();

    // SECURE TRANSACTION
    try {
        await client.query("BEGIN");
        const query = 'SELECT balance FROM financial_info WHERE user_id=$1';
        let values = [userid]
        
        const res = await client.query(query, values);
        
        // check balance amount
        if (res.rows[0].balance >= amount) {

            // Subtract account balance from user account
            const update_query = 'UPDATE financial_info SET balance = balance - $1 WHERE user_id=$2 AND account_number=$3';
            let updateValues = [amount, userid, account];
            const update_res = await client.query(update_query, updateValues);

            if (update_res.rowCount == 1) {
                await client.query("COMMIT");
                if(secure){
                    fs.appendFileSync('logs/withdrawals.log', new Date().toISOString() + ': ' + amount + ' withdrawn from account '
                        + account + '\n');
                }
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
            console.log(err)
            return {"Error": "Database Error, see console."};
        }
    } finally {
        client.release();
    }
}


// Transfer account values
async function transfer(userid, fromAccount, toAccount, amount, secure) {

    // get client connection
    const client = await (
        (secure) ? db.pool : db.superPool
    ).connect();
    try {
        // start transaction
        await client.query("BEGIN");

        // INSECURE TRANSFER
        if (!secure) {            
            // basic checks
            if (amount < 0) {
                throw {"Error":"Can only transfer a positive amount"};
            }

            // transfer amount to separate account
            let transferTo_query = `UPDATE financial_info SET balance = balance + ${amount} WHERE account_number=${toAccount}`
            let transferFrom_query = `UPDATE financial_info SET balance = balance - ${amount} WHERE account_number=${fromAccount}`
            await client.query(transferTo_query);
            await client.query(transferFrom_query);

            await client.query("COMMIT");
            return {"Success":"Money successfully transferred"};                
        }
        // SECURE TRANSFER
        else {
            // basic checks
            if (amount < 0) {
                throw {"Error":"Can only transfer a positive amount"};
            }
            // Check if self
            if (fromAccount == toAccount){
                throw {"Error":"Cannot transfer to self"}
            }

            // get current account values
            let balance_query = 'SELECT balance FROM financial_info WHERE user_id=$1 AND account_number=$2';
            let balanceValues = [userid, fromAccount];
            const balance_res = await client.query(balance_query, balanceValues);

            // check account value is greater than amount
            if (balance_res.rows[0].balance >= amount) {

                // check that second account exists
                let account_query = 'SELECT COUNT(1) FROM financial_info WHERE account_number=$1';
                let accountValues = [toAccount];
                const account_res = await client.query(account_query, accountValues);

                // account exists
                if (account_res.rows[0].count == 1) {

                    // transfer amount to separate account
                    let transferTo_query = 'UPDATE financial_info SET balance = balance + $1 WHERE account_number=$2';
                    let transferToValues = [amount, toAccount];
                    let transferFrom_query = 'UPDATE financial_info SET balance = balance - $1 WHERE account_number=$2';
                    let transferFromValues = [amount, fromAccount];
                    const transferTo_res = await client.query(transferTo_query, transferToValues);
                    const transferFrom_res = await client.query(transferFrom_query, transferFromValues);

                    if (transferTo_res.rowCount == 1 && transferFrom_res.rowCount == 1) {
                        await client.query("COMMIT");
                        if(secure){
                            fs.appendFileSync('logs/transfers.log', new Date().toISOString() + ': ' + amount + ' transferred from account '
                                + fromAccount + ' to account ' + toAccount + '\n');
                        }
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
    }
    catch(err) {
        // Rollback transaction
        await client.query("ROLLBACK");

        // Pass error message to controller
        if (err.Error) {
            return err;
        }
        else {
            console.log(err)
            return {"Error": "Database Error, see console."};
        }
    }
    finally {
        client.release();
    }
}

// Deposit money from a given account and user id
async function deposit(userid, account, amount, secure) {
    // get client connection
    const client = await db.pool.connect();

    // SECURE TRANSACTION
    try {
        await client.query("BEGIN");
        // Add amount to user account balance
        const update_query = 'UPDATE financial_info SET balance = balance + $1 WHERE user_id=$2 AND account_number=$3';
        let updateValues = [amount, userid, account];
        const update_res = await client.query(update_query, updateValues);

        if (update_res.rowCount == 1) {
            await client.query("COMMIT");
            if(secure){
                fs.appendFileSync('logs/deposits.log', new Date().toISOString() + ': ' + amount + ' deposit into account '
                    + account + '\n');
            }
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
            console.log(err)
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
    // SECURE QUERY
    // get account info
    const select_query = 'SELECT balance, routing_number, account_number FROM financial_info WHERE user_id=$1';
    let selectValues = [userid];
    var select_res = await client.query(select_query, selectValues);

    client.release();
    return select_res;
}

// Get all users' financial info  
async function getAllFinancialInfo(){
    // get client connection
    const client = await db.pool.connect();

    const select_query = `select username, account_id, f.user_id, routing_number, account_number, balance from financial_info f join users u on f.user_id = u.user_id;`;
    var select_res = await client.query(select_query);

    client.release();
    return select_res;
}

async function checkValidUsername(username){
    // get client connection
    const client = await db.pool.connect();

    // SECURE QUERY
    const select_query = 'SELECT TRUE as exists, user_id, password_hash FROM users WHERE username = $1 LIMIT 1';
    let selectValues = [username];
    var select_res = await client.query(select_query, selectValues);

    client.release();
    return select_res;
}

async function createUser(user, pass){
    // get client connection
    const client = await db.pool.connect();

    // SECURE TRANSACTION
    try {
        await client.query("BEGIN");
        // Create hashed pass
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(pass, salt);
        
        // Try to insert new user
        const insert_query = 'INSERT INTO users (username, password, password_hash) VALUES ($1, $2, $3) RETURNING user_id';
        let insertValues = [user, pass, hash];
        const insert_res = await client.query(insert_query, insertValues);

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

    // SECURE TRANSACTION
    try {
        await client.query("BEGIN");
        
        const routing = faker.finance.routingNumber();
        const account = faker.finance.account();
        let insertPerQuery = 'INSERT INTO personal_info (first_name, last_name, birth_date, email, user_id) VALUES ($1, $2, $3, $4, $5);';
        let insertPerValues = [first, last, bday, email, uid];
        let insertFinQuery = 'INSERT INTO financial_info (user_id, routing_number, account_number, balance) VALUES ($1, $2, $3, 0.);';
        let insertFinValues = [uid, routing, account];
        
        // Try to insert new user info
        const insertPerRes = await client.query(insertPerQuery, insertPerValues);
        const insertFinRes = await client.query(insertFinQuery, insertFinValues);

        if (insertPerRes.rowCount == 1 && insertFinRes.rowCount == 1) {
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

    // SECURE QUERY
    const select_query = 'SELECT * FROM personal_info INNER JOIN financial_info ON personal_info.user_id = financial_info.user_id where personal_info.user_id = $1';
    let selectValues = [userid];
    var select_res = await client.query(select_query, selectValues);

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