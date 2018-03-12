// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app   = express();
var passport = require('passport');
var flash    = require('connect-flash');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ip = '192.168.1.15';
// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration
// set up our express application
app.use(express.static('public'))//for css
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static('img'));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

server.listen(3000,ip)//192.168.1.15
console.log("connected to server")

io.on('connection',(socket) =>{
	console.log("New user connected")

	socket.on('change_username', (data) => {
			socket.username = data.username
	})

	socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})
