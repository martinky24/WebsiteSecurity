var express = require('express');
var router = express.Router();
let dbMethods = require("./../dbMethods");
let rMethods = require("./../routeMethods");
let queries = require("../data/queries");

router.get('/withdrawals', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/login');
	}

	// Call database query
	dbMethods.getAccountInfo(req.session.userID,(result)=>{
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
	})
});


// Route to transfer specified balance
router.post("/withdrawals", async (req, res) => {
	// Admin cannot access accounts
	if(req.session.uname == "admin"){
		return rMethods.saveSessionContext({message:"The user Admin does not have financial/personal info set"},req,()=>{
			res.redirect(req.headers.referer)
		});
	}
	
	// execute withdrawal
	
	const result = await queries.withdrawal(req.session.userID, req.body.fromAccount, req.body.amount);

	console.log(result);
	if (result.Error) {
		rMethods.saveSessionContext({error:result.Error}, req, () => {
			res.redirect(req.headers.referer);
		})
	}
	else {
		rMethods.saveSessionContext({success:result.Success}, req, () => {
			res.redirect(req.headers.referer);
		})
	}

})

module.exports = router;