var LocalStrategy = require('passport-local').Strategy;
var User = require("./models").User

require("./prototypes")()

module.exports= (passport) => {
    passport.use('local' ,new LocalStrategy({usernameField: 'email', passReqToCallback: true}, function(req, email, password, done) {
  process.nextTick(_ => {
	User.findOne({
			'email': email,
	}, function(err, user) {
		if (err) {
			return done(err);
		}

		if (!user) {
		  return done(null, false);
		}

		if (!user.validPassword(password)) {
		  return done(null, false);
		}
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		user.lastIp=ip;
		user.save()
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
			user.name = req.body.name.toProperCase();
			user.surname = req.body.surname.toProperCase();
			user.class = req.body.class.toProperCase();
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
}