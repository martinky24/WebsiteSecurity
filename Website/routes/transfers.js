var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
// var connection = require('../dbcon.js');

router.get('/transfers', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/login');
	}
	
	res.render('pages/transfers',{
		username:req.session.uname,
		secure: req.session.secure
	});
});

module.exports = router;