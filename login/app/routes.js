// app/routes.js
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser = require('body-parser');
connection.query('USE ' + dbconfig.database);
module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());


	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage')});
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/main', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
	);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/login', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/main', isLoggedIn, function(req, res) {
		connection.query("SELECT * FROM `friends` join users on users.id = friends.secondId WHERE firstId =  ?",[req.user.id],function(err,results){
		res.render('chatee.ejs', {
			user : req.user, // get the user out of session and pass to template
			message:req.flash('errorMessage'), //to show message if adding friends has problems
			friends:results
		});
		});
	});
	// =====================================
	// Friends SECTION =========================
	// =====================================
app.post('/friends',isLoggedIn,function(req,res){
	//gets friends of user
connection.query("SELECT * FROM `friends` join users on users.id = friends.secondId WHERE firstId =  ?",[req.body.id],function(err,results){
		if(err){

		}else{
		console.log(req.body.id);
		res.render('friends.ejs',{friends: results});
		}
	});
});

app.post('/add',isLoggedIn,function(req,res){
	//check if friend exists
	connection.query("Select id from users where username = ?",[req.body.friend],function(err,fresult){
		if(fresult='0'){
			connection.query("SELECT * FROM users WHERE id = ?",[req.id], function(err, results){
			req.flash('errorMessage', 'No such user');
			res.render('chatee.ejs',{
				user:results,
				message:req.flash('errorMessage')
			});
		});
		}else{
			//insert friend into db if found
			connection.query("INSERT INTO friends(firstId,secondId) values (?,?)",[req.body.id,fresult[0].id],function(err,sresult){
			// get friends of the user
			connection.query("SELECT * FROM `friends` join users on users.id = friends.secondId WHERE firstId =  ?",[req.body.id],function(err,results){
			res.render('friends.ejs',{friends:results});
				});
			});
		}
	});
});
app.post('/update',function(req, res){
	connection.query("UPDATE users SET name = ?, interests = ?, address = ?, gender = ? WHERE id = ?", [req.body.name, req.body.interest, req.body.address, req.body.gender, req.body.id], function(err, fresult){
		console.log(fresult);
		if(err){
			console.log("wrong");
		}
		connection.query("SELECT * FROM users WHERE id = ?", [req.body.id], function(err, fresult){
			res.render('chatee.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		});
	});
});


	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
