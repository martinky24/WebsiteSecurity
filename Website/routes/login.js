var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dbCon = require("./../dbcon");

function checkValidUser(user,pass,callback){
	var query = `SELECT TRUE as exists, user_id FROM users WHERE password = '${pass}' AND username = '${user}' LIMIT 1 `
    dbCon.runDBQuery(query, callback);
}

router.get('/login', function(req, res, next) {

	if (req.session.uname) {
		return res.redirect('/home');
	}

	var loginUser = async function(req, res){
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
					res.redirect("/home");
				});
			} else {
				res.render('pages/login',{
					secure: req.session.secure,
					message: "Incorrect Username or Password"
				});
			}
		})
	}
	// MAKES ROUTE ONLY AVAILABLE WHEN ON LOGIN PAGE
	router.post('/loginUser', loginUser);
	res.render('pages/login',{
		secure: req.session.secure,
		message: ""
	});
});

module.exports = router;