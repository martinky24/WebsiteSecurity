var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dbCon = require("./../dbcon");

function getAccountsInfo(callback){
    var query = `SELECT * FROM financial_info`;
    dbCon.runDBQuery(query, callback);
}

router.get('/admin', function(req, res, next) {
    content = [];
    content.username = req.session.uname;

    if ((req.session.secure) && (req.session.uname != "admin")) {
        return res.redirect('/home');
    }
    getAccountsInfo(function (results, err) {
        content.data = results.rows;
        res.render('pages/admin', content);
    });
    
});

module.exports = router;