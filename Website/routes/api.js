var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var dbCon = require("./../dbcon");
var dbMethods = require('./../dbMethods');
var dbtables = require("./../dbtables");
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

router.post('/resettables', function(req, res, next) {
    if ((req.session.uname == "admin") || !req.session.secure) {
        console.log("resetting tables");
        dbtables.fillTables(5, (results) => {
            res.redirect(req.headers.referer)
        });
    } else {
        res.redirect(req.headers.referer)
    }
});

router.post('/makedeposit', function(req, res, next) {
    //console.log(req.body)
    if(req.session.uname=="admin"){
        return rMethods.saveSessionContext({message:"The user Admin does not have financial/personal info set"},req,()=>{
            res.redirect(req.headers.referer)
        });
    }
    if(!req.body.amount || req.body.amount <= 0){
        return rMethods.saveSessionContext({warning:"The deposit amount must be a positive, non-zero number"},req,()=>{
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