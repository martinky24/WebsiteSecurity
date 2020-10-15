var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
// var connection = require('../dbcon.js');

router.get('/secure/deposits', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/secure/login');
	}
	
	res.render('pages/secure/deposits');
});

router.get('/insecure/deposits', function(req, res, next) {

	res.render('pages/insecure/deposits');
});

module.exports = router;