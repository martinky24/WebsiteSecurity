var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dbCon = require("./../dbcon");

function checkValidUser(user,pass,callback){
	var query = `SELECT TRUE as exists, user_id FROM users WHERE password = '${pass}' AND username = '${user}' LIMIT 1 `
    dbCon.runDBQuery(query, callback);
}

router.get('/secure/login', function(req, res, next) {

	if (req.session.uname) {
		return res.redirect('/secure/home');
	}
	
	/*
		Server processing code, e.g. DB calls, goes here
	*/

	var loginUserSecure = async function(req, res){
		var password = req.body.pword;
		var username = req.body.loginUsername
		// IMPLEMENT THIS WITH BCRYPT

		checkValidUser(username, password, (qResult)=>{
			if (dbCon.hasQueryResult(qResult) && qResult.rows[0].exists) {
				req.session.uname = username;
				req.session.userID = qResult.rows[0].user_id // Store for easy personal/financial lookup
				console.log('Logging in as user ',req.session.uname, "\nWith uid:", req.session.userID);

				req.session.save((err)=>{
					if(err){
						console.log(err)
					}
					res.redirect("/secure/home");
				});
			} else {
				res.send({
					"code":204,
					"success":"Incorrect username or password"
				})
			}
		})
	}
	// MAKES ROUTE ONLY AVAILABLE WHEN ON LOGIN PAGE
	router.post('/loginUserSecure', loginUserSecure);
	express().use('/api', router);
	res.render('pages/secure/login');
});

router.get('/insecure/login', function(req, res, next) {

	if (req.session.uname) {
		return res.redirect('/insecure/home');
	}
	/*
		Server processing code, e.g. DB calls, goes here
	*/

	var loginUserInsecure = async function(req, res){
		var password = req.body.pword;
		var username = req.body.loginUsername

		// IMPLEMENT THIS WITH BCRYPT

		checkValidUser(username, password, (qResult)=>{
			if (dbCon.hasQueryResult(qResult) && qResult.rows[0].exists) {
				req.session.uname = username;
				req.session.userID = qResult.rows[0].user_id // Store for easy personal/financial lookup
				console.log('Logging in as user ',req.session.uname, "\nWith uid:", req.session.userID);

				req.session.save((err)=>{
					if(err){
						console.log(err)
					}
					res.redirect("/insecure/home");
				});
			} else {
				res.send({
					"code":204,
					"success":"Incorrect username or password"
				})
			}
		})
	}
	// MAKES ROUTE ONLY AVAILABLE WHEN ON LOGIN PAGE
	router.post('/loginUserInsecure', loginUserInsecure);
	express().use('/api', router);
	res.render('pages/insecure/login');
});

module.exports = router;