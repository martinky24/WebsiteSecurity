var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dbMethods = require('./../dbMethods')
var dbCon = require("./../dbcon");

router.get('/deposits', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/login');
	}
	// if(req && req.savedContext){
	// 	console.log("savedcontext:",req.savedContext);
	// }
	dbMethods.getDepositInfo(req.session.userID,(qResult)=>{
		var balance = "N/A";
		var account_number = "N/A";
		if (dbCon.hasQueryResult(qResult)){
			balance = qResult.rows[0].balance;
			account_number = qResult.rows[0].account_number;
			// console.log("balance:",balance,"\naccount_number:",account_number)
		}
		
		res.render('pages/deposits',Object.assign({
			username:req.session.uname,
			balance: balance,
			account_number: account_number,
			secure: req.session.secure
		},req.savedContext));
	})
});

module.exports = router;