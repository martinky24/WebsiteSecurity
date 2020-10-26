var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
// var connection = require('../dbcon.js');

function getPersonalinfo(userid, callback){
	var query = `SELECT * FROM personal_info WHERE user_id = '${userid}' LIMIT 1`;
    dbCon.runDBQuery(query, callback);
}

router.get('/account', function(req, res, next) {
	if (! req.session.uname) {
		return res.redirect('/login');
	}
	content = [];
	uid = req.session.userID;
	content.username = req.session.uname;
	content.secure = req.session.secure;
	content.first = "John";
	content.last = "Doe";
	content.birthday = "10/16/2023";
	content.email = "a@a.com";
	content.account = "123456789";
	content.routing = "123456";
	content.balance = "$4.20";
	getPersonalinfo(req.session.userID, (qResult)=>{
		
	});

	res.render('pages/account', content);
});

module.exports = router;