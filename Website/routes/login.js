var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
// var connection = require('../dbcon.js');

router.get('/secure/login', function(req, res, next) {

	if (req.session.uname) {
		return res.redirect('/secure/home');
	}
	
	/*
		Server processing code, e.g. DB calls, goes here
	*/

	var loginUserSecure = async function(req, res){
		var password = req.body.pword;

		// IMPLEMENT THIS WITH BCRYPT


		// CURRENTLY ACCEPTS ANY USERNAME SO LONG AS PASSWORD IS 'admin'
		if (password === "admin") {
			req.session.uname = req.body.loginUsername;
			console.log('Logging in as user ' + req.session.uname);
			res.redirect("/secure/home");
		} else {
			res.send({
				"code":204,
				"success":"Incorrect username or password"
			})
		}
	}

	router.post('/loginUserSecure', loginUserSecure);
	express().use('/api', router);
	res.render('pages/secure/login');
});

router.get('/insecure/login', function(req, res, next) {

	/*
		Server processing code, e.g. DB calls, goes here
	*/

	var loginUserInsecure = async function(req, res){
		var password = req.body.pword;

		// IMPLEMENT THIS WITH BCRYPT


		// CURRENTLY ACCEPTS ANY USERNAME SO LONG AS PASSWORD IS 'admin'
		if (password === "admin") {
			req.session.uname = req.body.loginUsername;
			console.log('Logging in as user ' + req.session.uname);
			res.redirect("/secure/home");
		} else {
			res.send({
				"code":204,
				"success":"Incorrect username or password"
			})
		}
	}

	router.post('/loginUserInsecure', loginUserInsecure);
	express().use('/api', router);
	res.render('pages/insecure/login');
});

module.exports = router;