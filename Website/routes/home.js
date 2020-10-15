var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

// var connection = require('../dbcon.js');

router.get('/secure/home', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/secure/login');
	}

	res.render('pages/secure/home');
});

router.get('/insecure/home', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/insecure/login');
	}
	
	res.render('pages/insecure/home');
});

module.exports = router;