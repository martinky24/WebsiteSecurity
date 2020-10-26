var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dbCon = require("./../dbcon");

function getAccountInfo(userid, callback){
    var query = `SELECT * FROM personal_info INNER JOIN financial_info ON personal_info.user_id = financial_info.user_id where personal_info.user_id = '${userid}'`;
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

    if(req.session.uname = "admin"){
            content.username = req.session.uname;
            content.first = "admin";
            content.last = "admin";
            content.birthday = "admin";
            content.email = "admin";
            content.account = "admin";
            content.routing = "admin";
            content.balance = "admin";
            res.render('pages/account', content);
    } else {
        getAccountInfo(req.session.userID, function (results, err) {
            if(err) {
                console.log('getAccountInfo(...) error occured: ' + err);
            };
            content.first = results.rows[0].first_name;
            content.last = results.rows[0].last_name;
            content.birthday = results.rows[0].birth_date.toLocaleDateString("en-US");
            content.email = results.rows[0].email;
            content.account = results.rows[0].account_number;
            content.routing = results.rows[0].routing_number;
            content.balance = results.rows[0].balance;
            res.render('pages/account', content);
        });
    }
});

module.exports = router;