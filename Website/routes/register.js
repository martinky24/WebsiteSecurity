var express = require('express');
var router = express.Router();
let rMethods = require('./../routeMethods');
let queries = require('../data/queries');

router.get('/register', function(req, res, next) {
    if (req.session.uname) {
        return res.redirect('/home');
    }
    res.render('pages/register',Object.assign({
        secure: req.session.secure,
    },req.savedContext));
});

router.post('/registerUser', async function(req, res, next) {
    var password = req.body.registerPword;
    var username = req.body.registerUsername
    var first = req.body.registerFirst;
    var last = req.body.registerLast;
    var bday = req.body.registerBday;
    var email = req.body.registerEmail;

    const result = await queries.checkValidUsername(username);
    if (result.rows.length > 0 && result.rows[0].exists) {
        await rMethods.saveSessionContext({warning:"Username already exists"},req);
        return res.redirect('/register');
    } else {
        await queries.createUser(username, password).then(userRes=>{
            uid = userRes.rows[0].user_id;
            queries.createUserInfo(first, last, bday, email, uid).then(async (userInfoRes)=>{
                await rMethods.saveSessionContext({success:userInfoRes.Success},req);
                return res.redirect("/login");
            }).catch(async err =>{
                console.log('createUserInfo(...) error occurred: ', err);
                await rMethods.saveSessionContext({error:"Error occurred during account creation"},req);
                return res.redirect('/register');
            });
        }).catch(async (err)=>{
            console.log('createUser(...) error occurred: ', err);
            await rMethods.saveSessionContext({error:"Error occurred during account creation"},req);
            return res.redirect('/register');
        });
    }
});

module.exports = router;