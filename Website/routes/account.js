var express = require('express');
var router = express.Router();
let queries = require('../data/queries')

router.get('/account',async function(req, res, next) {
    if (! req.session.uname) {
        return res.redirect('/login');
    }
    content = [];
    uid = req.session.userID;
    content.username = req.session.uname;
    content.secure = req.session.secure;

    if(req.session.uname == "admin"){
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
        await queries.getAccountInfo(req.session.userID).then(results=>{
            content.first = results.rows[0].first_name;
            content.last = results.rows[0].last_name;
            content.birthday = results.rows[0].birth_date.toLocaleDateString("en-US");
            content.email = results.rows[0].email;
            content.account = results.rows[0].account_number;
            content.routing = results.rows[0].routing_number;
            content.balance = results.rows[0].balance;
            res.render('pages/account', content);
        }).catch(async err=>{
            console.log('getAccountInfo(...) error occurred: ' + err);
            await rMethods.saveSessionContext({error:"Error occurred when when trying to reach account"},req);
            res.redirect(req.headers.referer);
        });
    }
});

module.exports = router;