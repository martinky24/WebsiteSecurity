var express = require('express');
var router = express.Router();
let rMethods = require("./../routeMethods");
let queries = require("../data/queries");

router.get('/deposits',async function(req, res, next) {
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
	res.render('pages/deposits',Object.assign({
		username:req.session.uname,
		balance: balance,
		account_number: account_number,
		secure: req.session.secure
	},req.savedContext));
});

router.post('/deposits', async function(req, res, next) {
    //console.log(req.body)
    if(req.session.uname == "admin"){
        return rMethods.saveSessionContext({message:"The user Admin does not have financial/personal info set"},req,()=>{
            res.redirect(req.headers.referer)
        });
    }
    if(!req.body.amount || req.body.amount <= 0){
        return rMethods.saveSessionContext({warning:"The deposit amount must be a positive, non-zero number"},req,()=>{
            res.redirect(req.headers.referer)
        });
	}
	// execute deposit
	const result = await queries.deposit(req.session.userID, req.body.to_account, req.body.amount);
	if (result.Error) {
		rMethods.saveSessionContext({error:result.Error}, req, () => {
			res.redirect(req.headers.referer);
		})
	}else {
		rMethods.saveSessionContext({success:result.Success},req,()=>{
			res.redirect(req.headers.referer)
		});
	}
});

module.exports = router;