// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
//var port     = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];
// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(express.static(__dirname + '/public'));//for css
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
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



server.listen(process.env.PORT || 3000,'192.168.1.15');
console.log('Server running....');

/*app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});*/

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Disconnect
  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  // Send message
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data, user:socket.username});
  });

  // New user
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.sockets.emit('get users', users);
  }
});
