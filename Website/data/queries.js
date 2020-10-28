const db = require("./dbcon");

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


module.exports = {
    withdrawal
}