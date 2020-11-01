var express = require('express');
var router = express.Router();
let bcrypt = require('bcryptjs');
let rMethods = require('./../routeMethods');
let queries = require('../data/queries');

router.get('/login', function(req, res, next) {

	if (req.session.uname) {
		return res.redirect('/home');
	}
	res.render('pages/login', Object.assign({
		secure: req.session.secure,
	}, req.savedContext));
});
router.post('/loginUser', async function(req, res, next) {
	var password = req.body.pword;
	var username = req.body.loginUsername
	
	// check if username exists and get hashedpass
	const result = await queries.checkValidUsername(username);

	// check if password matches hashed
	if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password_hash)) {
		req.session.uname = username;
		req.session.userID = result.rows[0].user_id // Store for easy personal/financial lookup
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

router.get('/logout', function(req, res, next) {
	console.log('Logging out as user ' + req.session.uname);
	req.session.destroy();

	res.redirect('/login');
});

module.exports = router;