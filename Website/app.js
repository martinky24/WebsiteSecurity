/******************
 * Load required packages, mostly boilerplate
 ******************/

/* Express for route handling */
var express = require('express');
var app = express();

/*  Express-session for storing session values */
const session = require('express-session');

var FileStore = require('session-file-store')(session);

app.use(session({
	name: 'server-session-cookie-id',
	secret: 'ssshhhhh',
	saveUninitialized: true,
	resave: true,
	store: new FileStore({logFn: function(){}}),
	retries: 0
}));

// for login
app.use(function(req, res, next) {
   res.locals.uname = req.session.uname;
   next();
});

/* Load EJS view engine */
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

/* body-parser used for parsing post requests as JSON */
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

/* This allows accessing resources using '/resource' instead of '/public/resource' (CSS, Images, etc...) */
const path = require('path');
app.set('views', path.join(__dirname, 'views/'));
app.set('views/secure', path.join(__dirname, 'views/secure/'));
app.set('views/insecure', path.join(__dirname, 'views/insecure/'));
app.use(express.static(__dirname + '/public'));
app.use('/public',  express.static(__dirname + '/public'));

const postgres = require('./dbcon.js');

/******************
 * Route handling
 ******************/

app.get('/', function(req, res) {
	// Logged in and session key exists
	if (req.session.uname) {
		return res.redirect('/secure/home');
	}
	// no session found, go to login page
	res.redirect('/secure/login');
});

/* Load in the code which processes the routing  */
var route_login = require("./routes/login.js");
var route_home = require("./routes/home.js");
var route_account = require("./routes/account.js");
var route_deposits = require("./routes/deposits.js");
var route_transfers = require("./routes/transfers.js");
var route_withdrawals = require("./routes/withdrawals.js");

app.use(route_login);
app.use(route_home);
app.use(route_account);
app.use(route_deposits);
app.use(route_transfers);
app.use(route_withdrawals);

app.get('/secure/logout', function(req, res, next) {
	console.log('Logging out as user ' + req.session.uname);
	req.session.destroy();

	res.redirect('/secure/login');
});

app.get('/insecure/logout', function(req, res, next) {
	console.log('Logging out as user ' + req.session.uname);
	req.session.destroy();

	res.redirect('/insecure/login');
});

/******************
 * Error pages
 ******************/

app.use(function (req, res) {
	res.status(404);
	res.render('404');
});

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});



/******************
 * Launch communication
 ******************/

const port = process.env.PORT || 54545;
app.listen(port);
console.log('Local server is running at http://localhost:' + port + '/.\nCMD+C to quit.');

module.exports = app;