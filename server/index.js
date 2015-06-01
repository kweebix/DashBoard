var express  = require('express');
var app      = express();
var port     = process.env.PORT || 5555;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var domain = require('domain');

var server = require('http').Server(app);

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var MongoStore = require('connect-mongo')(session);


var io = require('socket.io')(server);

var databaseURL = require('../config/config.js').database.url;

server.listen(port);

// configuration ===============================================================
mongoose.connect(databaseURL); // connect to our database

var mongoStore = new MongoStore({mongooseConnection: mongoose.connection});

require('../config/passport')(passport); // pass passport for configuration

var passportSocketIo = require("passport.socketio");


app.set('views', __dirname + '/../client');

// set up our express application
//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
 secret: 'ilovescotchscotfsefeschyscotchscotch', 
 key: 'express.sid',
 store: mongoStore 
 })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use('/static', express.static('./client/static/'));
app.use('/views', express.static('./client/views/'));


// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



// Socket.io ==================
//With Socket.io >= 1.0
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  secret: 'ilovescotchscotfsefeschyscotchscotch',
  key: 'express.sid',
  passport: passport,
  store:        mongoStore,        // we NEED to use a sessionstore. no memorystore please
  fail: function(data, message, error, accept){ 
    console.log('fail', message, error);
    accept(null, false);
  },
  sucess: function(){ 
    accept();
  }
}));

var d = domain.create();
d.run(function(){
  require('./sockets.js')(io, d); 
});


// launch ======================================================================
console.log('The magic happens on port ' + port);