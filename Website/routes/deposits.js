var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
// var connection = require('../dbcon.js');

router.get('/deposits', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/login');
	}
	
	res.render('pages/deposits',{
		username:req.session.uname,
		balance: "testBalance",
		accountid: "testAccountid",
		secure: req.session.secure
	});
});

module.exports = router;