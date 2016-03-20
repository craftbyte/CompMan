var mongoose = require('mongoose')


var schema = new mongoose.Schema({
	name: String,
	description: String,
	selected: {
		type: Boolean,
		default: false
	},
	date: {
	    type: Date,
	    default: Date.now()
	},
	_creator: {
	    type: mongoose.Schema.ObjectId,
	    ref: 'User'
	},
	file: {
		type: mongoose.Schema.ObjectId
	},
	thumbnail: {
		type: mongoose.Schema.ObjectId
	}
})

module.exports = mongoose.model('Submission', schema);
