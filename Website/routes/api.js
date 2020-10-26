var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dbCon = require("./../dbcon");
var dbMethods = require('./../dbMethods')

router.use('/',function (req, res, next) {
    console.log("i'm on an api route")
    next();
});
router.post('/togglesecurity', function(req, res, next) {
    req.session.secure = !req.session.secure;
    console.log("Secure:",req.session.secure)
    routeUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    // console.log("req.headers.referer",req.headers.referer,"\nrouteUrl",routeUrl)
    req.session.save((err)=>{
        if(err){
            console.log(err)
        }
        if(req.headers.referer && req.headers.referer != routeUrl){
            res.redirect(req.headers.referer)
        }else{
            res.send(`toggled the site security ${(req.session.secure)?"On":"Off"}`)
        }
    });
});

router.post('/makedeposit', function(req, res, next) {
    //console.log(req.body)
    dbMethods.deposit(req.body.amount,req.session.userID,(qResult)=>{
        if(qResult && qResult.rowCount > 0){
            res.redirect(req.headers.referer)
        }else{
            res.send(`Deposit failed?`)
        }
    });
});

module.exports = router;