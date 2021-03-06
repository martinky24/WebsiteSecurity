var express = require('express');
var router = express.Router();
let rMethods = require("./../routeMethods");
let queries = require("../data/queries");

router.get('/withdrawals', async function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/login');
	}
	
	// Call database query
	const result = await queries.getUserInfo(req.session.userID);
	var balance = "N/A";
	var account_number = "N/A";

	// check valid query response
	if (result.rows.length > 0){
		balance = result.rows[0].balance;
		account_number = result.rows[0].account_number;
	}

	// render page
	res.render('pages/withdrawals',Object.assign({
		username:req.session.uname,
		secure: req.session.secure,
		balance: balance,
		account_number: account_number
	},req.savedContext));
});


// Withdrawal cash
router.post("/withdrawals", async (req, res) => {
	// Admin cannot access accounts
	if(req.session.uname == "admin"){
		await rMethods.saveSessionContext({message:"The user Admin does not have financial/personal info set"},req);
        return res.redirect(req.headers.referer);
	}
	
	// execute withdrawal
	const result = await queries.withdrawal(req.session.userID, req.body.fromAccount, req.body.amount, req.session.secure);

	//console.log(result);
	if (result.Error) {
		await rMethods.saveSessionContext({error:result.Error},req);
        return res.redirect(req.headers.referer);
	}
	else {
		await rMethods.saveSessionContext({success:result.Success},req);
        return res.redirect(req.headers.referer);
	}

})

module.exports = router;