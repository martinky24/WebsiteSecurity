var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
// var connection = require('../dbcon.js');

router.get('/secure/transfers', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/secure/login');
	}
	
	res.render('pages/secure/transfers');
});

router.get('/insecure/transfers', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/insecure/login');
	}
	
	res.render('pages/insecure/transfers');
});

module.exports = router;