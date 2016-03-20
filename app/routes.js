var models = require("./models"),
	User = models.User,
	Submission = models.Submission,
	mongoose = require("mongoose"),
	storage = require('gridfs-storage-engine')({
		database: 'Natecaj'
	}),
	multer = require('multer'),
	upload = multer({ storage: storage }),
	Grid = require('gridfs-stream'),
	conn = mongoose.createConnection('mongodb://localhost/Natecaj');
	var gfs;
	conn.once('open', function () {
	  gfs = Grid(conn.db, mongoose.mongo);
	})

require("./prototypes")


module.exports = function(app, passport) {
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		User.findById(user._id, function(err, user) {
			done(err, user);
		});
	});

	app.use((req,res,next) => {
		if (req.session.message) {
			res.locals.message = req.session.message;
			req.session.message = undefined;
		}
		res.locals.page= req.path;
		next()
	})

	app.get('/', (req,res) => {
		if (req.isAuthenticated()) {
			res.locals.user = req.user;
			if (req.user.type == "admin" || req.user.type == "moderator") {
				Submission.find().populate('_creator').lean().exec((_, submissions) => {
					res.render("admin/moderator", {submissions: submissions})
				})
			} else {
				res.render('home')
			};
		}
		else {
			res.render('index');
		}
	})

	app.get('/instructions', (req, res) => {
		res.render('instructions.jade')
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

	app.use((req, res, next) => {
 		if (req.isAuthenticated()) {
			res.locals.user = req.user;
			next();
 		} else {
 			res.redirect('/');
 		}
	});

	app.get('/file/:id', (req, res) => {
		gfs.createReadStream({
		    _id: req.params.id
		}).pipe(res);
	});

	app.get('/file/:id/download', (req, res) => {
		gfs.findOne({ _id: req.params.id}, function (_, file) {
			res.set('Content-Disposition', 'attachment; filename='+file.filename);
			res.set('Content-Type', file.contentType);

			gfs.createReadStream({
			    _id: req.params.id
			}).pipe(res);
		});
	});

	app.get('/submit', (req, res) => {
		res.render('submit');
	});

	var submissionUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }])

	app.post('/submit', submissionUpload, (req, res) => {
			// req.files.file[0].gridfsEntry._id is file id
			// req.files.thumbnail[0].gridfsEntry._id is thumbnail id
			var submission = new Submission();
			submission.name = req.body.name;
			submission.description = req.body.description;
			submission._creator = req.user._id;
			submission.thumbnail =  req.files.thumbnail[0].gridfsEntry._id;
			submission.file =  req.files.file[0].gridfsEntry._id;
			submission.save();
			req.session.message = {
				type: "success",
				content: "Naloga je bila uspešno oddana"
			}
			res.redirect("/")
	})

	app.get('/submissions', (req,res) => {
		if (req.user.type == "admin" || req.user.type == "moderator") {
			Submission.find().populate("_creator").lean().exec((_, submissions) => {
				res.send(submissions)
			})
		} else {
			Submission.find({_creator: req.user._id}).populate("_creator").lean().exec((_, submissions) => {
				res.send(submissions)
			})
		}
	})

	app.put('/select/:id', isModerator, (req,res) => {
		Submission.findById(req.params.id, (_, submission) => {
			submission.selected = req.body.state;
			submission.save()
			res.send(submission)
		})
	})

	app.get("/users", isAdmin, (req, res) => {
		User.find(function (err, users){
			res.render("admin/users", {users: users})
		});
	})

	app.get("/user/:id", isAdmin, (req, res) => {
		User.findById(req.params.id).lean().exec((err, user) => {
			res.render("admin/user", {edituser: user})
		})
	})

	app.post("/user/:id", isAdmin, (req,res) => {
		User.findById(req.params.id).exec((err,user) => {
			var properAttributes = ["name", "surname", "class"]
			properAttributes.forEach((attribute) => {
				user[attribute] = req.body[attribute].toProperCase(true);
			})
			var attributes = ["email", "type"]
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

		req.session.message = {
			type: 'warning',
			content: 'Stran je namenjena le osebju'
		}
		res.redirect('/');
	}

	function isModerator(req, res, next) {
		if (req.user.type == "moderator" || req.user.type == "admin")
		    return next();

		req.session.message = {
			type: 'warning',
			content: 'Stran je namenjena le osebju'
		}

		res.redirect('/');
	}
}
