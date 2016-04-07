var express = require('express'),
morgan = require('morgan'),
passport = require('passport'),
mongoose = require('mongoose/'),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
models = require('./app/models'),
User = models.User,
MongoStore = require('connect-mongo')(session),
app = express(),
config=require("./config");

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
	secret: 'tuj7hzj6rfgt57ujhziofwefiweafweuihf34zr823jfvsbzvh8vb34hb4fsdfu83',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());

//connect to DB

mongoose.connect(config.databaseUrl);

User.findOne( {type: 'admin'}, function (err, result) {
  if (!result) {
    var user = new User();
    user.name = 'Super';
    user.surname = 'Administrator'
    user.school = 'Data Center'
    user.email = 'admin@local';
    user.local.password = user.generateHash('admin');
    user.type = 'admin';
    user.save();
    console.log('created new admin user (email: admin@local, password: admin)');
  }
})

//main config

fs = require ('fs');


//passport config

require("./app/passport")(passport);

//routes

require("./app/routes")(app, passport);

//error handle

app.use((req, res, next) => {
  res.redirect('/');
});

app.listen(process.env.PORT||3000, function () {
  console.log('Running on port '+(process.env.PORT||3000));
});
