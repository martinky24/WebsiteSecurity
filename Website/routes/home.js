var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
// var connection = require('../dbcon.js');

router.get('/secure/home', function(req, res, next) {

	res.render('pages/secure/home');
});

router.get('/insecure/home', function(req, res, next) {

	res.render('pages/insecure/home');
});

module.exports = router;