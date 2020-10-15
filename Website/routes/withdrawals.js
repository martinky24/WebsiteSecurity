var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
// var connection = require('../dbcon.js');

router.get('/secure/withdrawals', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/secure/login');
	}
	
	res.render('pages/secure/withdrawals');
});

router.get('/insecure/withdrawals', function(req, res, next) {

	res.render('pages/insecure/withdrawals');
});

module.exports = router;