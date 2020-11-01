var express = require('express');
var router = express.Router();
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

module.exports = router;