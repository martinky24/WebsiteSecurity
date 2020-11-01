var express = require('express');
var router = express.Router();
let dbCon = require("./../dbcon");
let faker = require('faker'); //https://github.com/marak/Faker.js/
let rMethods = require('./../routeMethods');

function checkValidUsername(user, callback){
    var query = `SELECT TRUE as exists, user_id FROM users WHERE username = '${user}' LIMIT 1 `
    dbCon.runDBQuery(query, callback);
}

function createLogin(user, pass, callback){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pass, salt);
    var query = `INSERT INTO users (username, password, password_hash) VALUES ('${user}', '${pass}', '${hash}') RETURNING user_id`;
    dbCon.runDBQuery(query, callback);
}

function createAccount(user, first, last, bday, email, uid, callback){
    var query = `INSERT INTO personal_info (first_name, last_name, birth_date, email, user_id) VALUES ('${first}', '${last}', '${bday}', '${email}', '${uid}')`;
    dbCon.runDBQuery(query, (qres) => {
        var routing = faker.finance.routingNumber();
        var account = faker.finance.account();
        var query = `INSERT INTO financial_info (user_id, routing_number, account_number, balance) VALUES ('${uid}', '${routing}', '${account}', 0.)`;
        dbCon.runDBQuery(query, callback);
    });
}

router.get('/register', function(req, res, next) {
    if (req.session.uname) {
        return res.redirect('/home');
    }
    res.render('pages/register',Object.assign({
        secure: req.session.secure,
    },req.savedContext));
});

router.post('/registerUser', function(req, res, next) {
    var password = req.body.registerPword;
    var username = req.body.registerUsername
    var first = req.body.registerFirst;
    var last = req.body.registerLast;
    var bday = req.body.registerBday;
    var email = req.body.registerEmail;


    checkValidUsername(username, (qResult)=>{
        if (dbCon.hasQueryResult(qResult) && qResult.rows[0].exists) {
            return rMethods.saveSessionContext({warning:"Username already exists"},req,()=>{
                res.redirect('/register')
            });
        } else {
            createLogin(username, password, (qResult)=>{
                uid = qResult.rows[0].user_id;
                createAccount(username, first, last, bday, email, uid, function (results, err) {
                    if(err) {
                        console.log('createAccount(...) error occured: ' + err);
                        return rMethods.saveSessionContext({error:"Error occurred during account creation"},req,()=>{
                            res.redirect('/register')
                        });
                    }
                    res.redirect("/login");
                });
            });
        }
    });
});

module.exports = router;