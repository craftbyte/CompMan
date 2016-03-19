var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var object = {
	email: {
		type: String, //TODO: make email datatype
		required: true
	},
	password: {
		type: String,
		required: true
	},
	name: String,
	surname: String
}

var schema = mongoose.Schema(object)

schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', schema);
