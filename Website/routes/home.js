var express = require('express');
var router = express.Router();

router.get('/home', function(req, res, next) {
	if (!req.session.uname) {
		return res.redirect('/login');
	}

	res.render('pages/home',Object.assign({
		username:req.session.uname,
		secure: req.session.secure
	}, req.savedContext));
});

module.exports = router;