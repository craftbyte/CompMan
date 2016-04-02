var LocalStrategy = require('passport-local').Strategy;
var User = require("./models").User
var SAMLProvider = require('passport-saml').Strategy;

require("./prototypes")()

module.exports = (passport) => {

	var SAMLStrategy = new SAMLProvider({
	    	callbackUrl: 'http://compman-craftbyte-1.c9users.io/saml/consume',
	    	entryPoint: 'https://idp.sc-nm.si/simplesaml/saml2/idp/SSOService.php',
	    	logoutUrl: 'https://idp.sc-nm.si/simplesaml/saml2/idp/SingleLogoutService.php',
	    	issuer: 'megavet'
		},
		function(account, done) {
			process.nextTick(_ => {
				User.findOne({'saml': {'nid': account.eduPersonPrincipalName}}, function(err, user) {
					if (err) {
						return done(err);
					}
					if (user) {return done(null, user);}
					else {
						var user = new User();

						user.email = account.eduPersonPrincipalName;
						user.saml.nid = account.eduPersonPrincipalName;
						user.name = account.givenName;
						user.surname = account.sn;
						user.save(function(err) {
			        	if (err) return done(err)
							return done(null, user);
						});
					}
				});
  			})
		}
  	)

	passport.use(SAMLStrategy);


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
			user.local.password = user.generateHash(password);
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			user.lastIp=ip;

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