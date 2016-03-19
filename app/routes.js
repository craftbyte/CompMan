module.exports = function(app, passport) {
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	app.get('/', (req,res) => {
		if (req.isAuthenticated()) {
			app.locals.user = req.user;
			res.render('home')
		}
		else {
			res.render('index')
		}
	})

	app.post('/login', (req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) return next(err); 
			if (!user) return res.status(403).send("fail"); 
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.send("success");
			});
		})(req,res,next)
	});

	app.post('/register', (req,res,next) => {
		passport.authenticate('local-signup', (err, user, info) => {
			if (err) return next(err); 
			if (!user) return res.status(403).send("fail"); 
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.send("success");
			});
		})(req,res,next)
	})

	app.get('/logout', (req, res, next) => {
		req.logOut();
		res.redirect('/')
	})

	app.use(function(req, res, next) {
 		if (req.isAuthenticated()) {
			res.locals.user = req.user;
			next();
 		}
 		else res.redirect('/')
	});

	app.get('/auth', (req,res) => res.send(req.user))

}