var express = require('express');
var router = express.Router();
var fs = require('fs');
let queries = require("../data/queries");

router.get('/admin', async function(req, res, next) {
    content = [];
    content.username = req.session.uname;

    if ((req.session.secure) && (req.session.uname != "admin")) {
        return res.redirect('/home');
    }
    const result = await queries.getAllFinancialInfo();
    content.data = result.rows;
    res.render('pages/admin', content);
});

router.get('/logs', async function(req, res, next) {
    if ((req.session.secure) && (req.session.uname != "admin")) {
        return res.redirect('/home');
    }
    res.sendFile('logs/access.log', { root: '.' })
});

router.post('/resetlogs', async function(req, res, next) {
    if ((req.session.secure) && (req.session.uname != "admin")) {
        return res.redirect('/home');
    }
    var options = { flag : 'w' };
    fs.writeFile('logs/access.log', "", options, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
    res.redirect("/admin");
});

module.exports = router;