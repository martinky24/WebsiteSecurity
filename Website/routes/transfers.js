var express = require('express');
var router = express.Router();
let rMethods = require("./../routeMethods");
let queries = require("../data/queries");

router.get('/transfers', async (req, res) => {
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
	res.render('pages/transfers',Object.assign({
		username:req.session.uname,
		secure: req.session.secure,
		balance: balance,
		account_number: account_number
	},req.savedContext));
});

// Route to transfer specified balance
router.post("/transfers", async (req, res) => {
	// Admin cannot access accounts
	if(req.session.uname == "admin"){
		return rMethods.saveSessionContext({message:"The user Admin does not have financial/personal info set"},req,()=>{
			res.redirect(req.headers.referer)
		});
	}
	
	// handle money transfer
	const result = await queries.transfer(req.session.userID, req.body.fromAccount, req.body.toAccount, req.body.amount)

	// handle response
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