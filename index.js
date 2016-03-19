var express = require('express'),
morgan = require('morgan'),
passport = require("passport"),
LocalStrategy = require('passport-local').Strategy,
mongoose = require('mongoose/'),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
models = require('./app/models'),
User = models.User,
app = express();

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
	secret: 'tuj7hzj6rfgt57ujhziofwefiweafweuihf34zr823jfvsbzvh8vb34hb4fsdfu83',
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost/Natecaj');

passport.use('local' ,new LocalStrategy({usernameField: 'email', passReqToCallback: true}, function(req, email, password, done) {
  process.nextTick(_ => {
  	console.log(email);
  	console.log(password)
	User.findOne({
			'email': email,
	}, function(err, user) {
		console.log(err,user)
		if (err) {
			return done(err);
		}

		if (!user) {
		  return done(null, false);
		}

		if (!user.validPassword(password)) {
		  return done(null, false);
		}
  	return done(null, user);
	});
  });
}));

passport.use('local-signup', new LocalStrategy({usernameField: 'email', passReqToCallback: true}, function(req, email, password, done) {
  process.nextTick(_ => {
	User.findOne({
			'email': email,
	}, function(err, user) {
		if (err) {
			return done(err);
		}

		if (user) {
		  return done(null, false);
		} else {
			var user = new User();

			user.email = email;
			user.name = name;
			user.surname = surname;
			user.password = user.generateHash(password);

			user.save(function(err) {
        if (err)
          throw err;
        return done(null, user);
      });
		}
	});
  });
}));

require("./app/routes")(app, passport)

app.use((req, res, next) => {
  res.redirect('/');
});

app.listen(process.env.PORT||3000, function () {
  console.log('Running on port '+(process.env.PORT||3000));
});
