var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

router.use('/',function (req, res, next) {
    console.log("i'm on an api route")
    next();
});
router.get('/togglesecurity', function(req, res, next) {
    req.session.secure = !req.session.secure;
    console.log("Secure:",req.session.secure)
    if(req.originalUrl.split("/").pop()!="togglesecurity"){
        res.redirect(req.originalUrl)
    }else{
        res.send(`toggled the site security ${(req.session.secure)?"On":"Off"}`)
    }
});

module.exports = router;