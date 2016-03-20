var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')


var schema = new mongoose.Schema({
	email: {
		type: String, //TODO: make email datatype
		required: true
	},
	password: {
		type: String,
		required: true
	},
	name: String,
	surname: String,
	class: String,
	type: {
		type: String,
		default: 'user',
		enum: ['user', 'mod', 'admin']
	}
})

schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', schema);
