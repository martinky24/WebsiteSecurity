var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dbCon = require("./../dbcon");
var rMethods = require('./../routeMethods');

function checkValidUser(user,pass,callback){
	var query = `SELECT TRUE as exists, password_hash, user_id FROM users WHERE username = '${user}' LIMIT 1 `
    dbCon.runDBQuery(query, callback);
}

router.get('/login', function(req, res, next) {

	if (req.session.uname) {
		return res.redirect('/home');
	}
	res.render('pages/login', Object.assign({
		secure: req.session.secure,
	}, req.savedContext));
});
router.post('/loginUser', function(req, res, next) {
	var password = req.body.pword;
	var username = req.body.loginUsername
	// IMPLEMENT THIS WITH BCRYPT

	checkValidUser(username, password, (qResult)=>{
		if (dbCon.hasQueryResult(qResult) && bcrypt.compareSync(password, qResult.rows[0].password_hash)) {
			req.session.uname = username;
			req.session.userID = qResult.rows[0].user_id // Store for easy personal/financial lookup
			console.log('Logging in as user ',req.session.uname, "\nWith uid:", req.session.userID);

			req.session.save((err)=>{
				if(err){
					console.log(err)
				}
				res.redirect("/home");
			});
		} else {
			rMethods.saveSessionContext({error:"Incorrect Username or Password"},req,()=>{
				res.redirect(req.headers.referer)
			});
		}
	});
});

router.get('/logout', function(req, res, next) {
	console.log('Logging out as user ' + req.session.uname);
	req.session.destroy();

	res.redirect('/login');
});

module.exports = router;