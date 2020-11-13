var express = require('express');
var router = express.Router();
let dbtables = require("../data/tableGen");
let rMethods = require('./../routeMethods');

router.post('/togglesecurity', async function(req, res, next) {
    req.session.secure = !req.session.secure;
    console.log("Secure:",req.session.secure)
    routeUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    // console.log("req.headers.referer",req.headers.referer,"\nrouteUrl",routeUrl)
    await rMethods.saveSession(req);
    if(req.headers.referer && req.headers.referer != routeUrl){
        res.redirect(req.headers.referer)
    }else{
        res.send(`toggled the site security ${(req.session.secure)?"On":"Off"}`)
    }
});

router.post('/resettables', async function(req, res, next) {
    if ((req.session.uname == "admin") || !req.session.secure) {
        console.log("resetting tables");
        await dbtables.fillTables(5)
        await rMethods.saveSessionContext({
            success: "All Users successfully reset"
        }, req);
    }
    res.redirect(req.headers.referer)
});

module.exports = router;