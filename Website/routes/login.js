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

var loginUser = async function loginUserAction(req, res, next){
	if (req.session.secure) {
		var password = req.body.pword;
		var username = req.body.loginUsername;
	} else {
		var password = req.query.pword;
		var username = req.query.loginUsername;
	}
	
	// check if username exists and get hashedpass
	const result = await queries.checkValidUsername(username);

	// check if password matches hashed
	if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password_hash)) {
		req.session.uname = username;
		req.session.userID = result.rows[0].user_id // Store for easy personal/financial lookup
		console.log('Logging in as user ',req.session.uname, "\nWith uid:", req.session.userID);
		await rMethods.saveSession(req);
		res.redirect("/home");
	} else {
		await rMethods.saveSessionContext({error:"Incorrect Username or Password"},req);
		return res.redirect(req.headers.referer);
	}
}

router.get('/loginUserInsecure', loginUser);
router.post('/loginUser', loginUser);

router.get('/logout', function(req, res, next) {
	console.log('Logging out as user ' + req.session.uname);
	req.session.destroy();

	res.redirect('/login');
});

module.exports = router;