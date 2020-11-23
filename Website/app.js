/******************
 * Load required packages, mostly boilerplate
 ******************/

/* logging middleware https://github.com/expressjs/morgan */
var morgan = require('morgan');
var fs = require('fs');
const path = require('path');

// configure ssl
var http = require("http");
const httpPort = process.env.httpPort;
const httpsPort = process.env.httpsPort;
var https = require("https");
var privateKey = fs.readFileSync(process.env.PRIVKEY, "utf8");
var certificate = fs.readFileSync(process.env.CERT, "utf8");
var credentials = {key: privateKey, cert: certificate};

/* Express for route handling */
var express = require('express');
var app = express();

/*  Express-session for storing session values */
const session = require('express-session');
var FileStore = require('session-file-store')(session);
var rMethods = require('./routeMethods');

/* This allows accessing resources using '/resource' instead of '/public/resource' (CSS, Images, etc...) */
app.set('views', path.join(__dirname, 'views/'));

/* Load EJS view engine */
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');


/********************
 * MIDDLEWARE
 ********************/
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });

// setup the logger
app.use(morgan(':date[web] :method :url :status', { stream: accessLogStream }));

// Set static folder
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));

/* body-parser used for parsing post requests as JSON */
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}))

// Set session data
app.use(session({
	name: 'server-session-cookie-id',
	secret: 'ssshhhhh',
	saveUninitialized: true,
	resave: true,
	store: new FileStore({
		logFn: function () {}
	}),
	retries: 0,
	cookie: {
		httpOnly: false
	}
}));

// all Routes requests hit this before proceeding
app.use(async function (req, res, next) {
	res.locals.uname = req.session.uname;
	if (req.query.secure) {
		// ie: /deposits?secure=true
		req.session.secure = req.query.secure.toLocaleLowerCase() == "true" ? true : false
		console.log("Session security was forced to be", req.session.secure)
	}
	if (req.session.secure == null) {
		req.session.secure = true
		console.log("resetting security mode")
	}
	res.locals.secure = req.session.secure;

	await rMethods.addSessionContextToRequest(req);

	// Redirect to https if session is secure and currently on http
	if (req.session.secure && req.protocol != "https") {
		console.log("Redirecting to https secure site.");
		return res.redirect("https://" + req.hostname + ":" + httpsPort + req.originalUrl);
	}
	// Redirect to http if session is not secure and currently on https
	if (!req.session.secure && req.protocol == "https") {
		console.log("Redirecting to http insecure site.");
		return res.redirect("http://" + req.hostname + ":" + httpPort + req.originalUrl);
	}
	next();
});


/******************
 * Route handling
 ******************/

app.get('/', function (req, res) {
	// Logged in and session key exists
	if (req.session.uname) {
		return res.redirect('/home');
	}
	// no session found, go to login page
	res.redirect('/login');
});

/* Load in the code which processes the routing  */
var route_login = require("./routes/login.js");
var route_home = require("./routes/home.js");
var route_account = require("./routes/account.js");
var route_deposits = require("./routes/deposits.js");
var route_transfers = require("./routes/transfers.js");
var route_withdrawals = require("./routes/withdrawals.js");
var route_api = require("./routes/api.js");
var route_register = require("./routes/register.js");
route_admin = require("./routes/admin.js");

app.use(route_login);
app.use(route_home);
app.use(route_account);
app.use(route_deposits);
app.use(route_transfers);
app.use(route_withdrawals);
app.use("/api",route_api);
app.use(route_register);
app.use(route_admin);


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
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(httpPort);
httpsServer.listen(httpsPort);

//const port = 54545;
console.log('Local server is running at insecure http://localhost:' + httpPort);
console.log('Local server is running at secure https://localhost:' + httpsPort)

module.exports = app;
