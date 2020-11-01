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

router.post('/deposits', function(req, res, next) {
    //console.log(req.body)
    if(req.session.uname=="admin"){
        return rMethods.saveSessionContext({message:"The user Admin does not have financial/personal info set"},req,()=>{
            res.redirect(req.headers.referer)
        });
    }
    if(!req.body.amount || req.body.amount <= 0){
        return rMethods.saveSessionContext({warning:"The deposit amount must be a positive, non-zero number"},req,()=>{
            res.redirect(req.headers.referer)
        });
    }
    dbMethods.deposit(req.body.amount,req.session.userID,(qResult)=>{
        if(qResult && qResult.rowCount > 0){
            res.redirect(req.headers.referer)
        }else{
            rMethods.saveSessionContext({error:"An error occured during deposit, check console for details"},req,()=>{
                res.redirect(req.headers.referer)
            });
        }
    });
});

module.exports = router;