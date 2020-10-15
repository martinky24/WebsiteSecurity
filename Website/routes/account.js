var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
// var connection = require('../dbcon.js');

router.get('/secure/account', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/secure/login');
	}
	
	res.render('pages/secure/account');
});

router.get('/insecure/account', function(req, res, next) {

	res.render('pages/insecure/account');
});

module.exports = router;