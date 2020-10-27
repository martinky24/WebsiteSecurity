var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dbCon = require("./../dbcon");
var dbMethods = require('./../dbMethods');
var rMethods = require('./../routeMethods');
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
    if(req.session.uname=="admin"){
        rMethods.saveSessionContext({info:"The user Admin does not have financial/personal info set"},req,()=>{
            res.redirect(req.headers.referer)
        });
    }
    if(req.body.amount <= 0){
        rMethods.saveSessionContext({warning:"The user Admin does not have financial/personal info set"},req,()=>{
            res.redirect(req.headers.referer)
        });
    }
    dbMethods.deposit(req.body.amount,req.session.userID,(qResult)=>{
        if(qResult && qResult.rowCount > 0){
            res.redirect(req.headers.referer)
        }else{
            rMethods.saveSessionContext({error:"An error occured during deposit, check console for details"},req,()=>{
                res.redirect(req.headers.referer)
            });
        }
    });
});

module.exports = router;