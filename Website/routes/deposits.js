var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
// var connection = require('../dbcon.js');

router.get('/secure/deposits', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/secure/login');
	}
	
	res.render('pages/secure/deposits',{
		username:"testuser",
		balance: "testBalance",
		accountid: "testAccountid",
		secure: true
	});
});

router.get('/insecure/deposits', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/insecure/login');
	}

	res.render('pages/insecure/deposits');
});

module.exports = router;