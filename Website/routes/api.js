var express = require('express');
var router = express.Router();
let dbtables = require("../data/fakeGen");

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

module.exports = router;