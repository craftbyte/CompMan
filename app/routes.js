var User = require("./models").User;

module.exports = function(app, passport) {
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		User.findById(user._id, function(err, user) {
			done(err, user);
		});
	});
	app.get('/', (req,res) => {
		if (req.isAuthenticated()) {
			res.locals.user = req.user;
			if (req.user.type == "admin" || req.user.type == "moderator") res.render("admin/moderator");
			else res.render('home');
		}
		else {
			res.render('index');
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
	
	app.get("/users", isAdmin, (req, res) => {
		if (req.session.message) {
			res.locals.message = req.session.message;
			req.session.message = undefined;
		}
		User.find(function (err, user){
			res.render("admin/users", {users: user})
		});
	})
	
	app.get("/user/:id", isAdmin, (req, res) => {
		User.findById(req.params.id).lean().exec((err, user) => {
			res.render("admin/user", {user: user})
		})
	})
	
	app.post("/user/:id", isAdmin, (req,res) => {
		User.findById(req.params.id).exec((err,user) => {
			var attributes = ["name", "surname", "email", "type"]
			attributes.forEach((attribute) => {
				user[attribute] = req.body[attribute];
			})
			if (req.body.password) user.password = user.generateHash(req.body.password);
			user.save();
			req.session.message = {type:"success", content:"Uporabnik uspešno urejen"}
			res.redirect("/users")
		})
	})
	
	app.get("/user/:id/delete", isAdmin, (req, res) => {
		if (req.user._id == req.params.id) {
			req.session.message = {type:"danger", content:"Sam sebe je nemogoče izbrisati"}
			return res.redirect("/users")
		}
		User.findById(req.params.id).remove().exec(_ => {
			req.session.message = {type:"success", content:"Uporabnik uspešno izbrisan"}
			res.redirect("/users")
		});
	})
	
	function isAdmin(req, res, next) {
		if (req.user.type == "admin")
		    return next();
		
		res.redirect('/');
	}
	
	function isModerator(req, res, next) {
		if (req.user.type == "moderator" || req.user.type == "admin")
		    return next();
		
		res.redirect('/');
	}

}
