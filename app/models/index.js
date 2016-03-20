[
	'User',
	'Submission',
].forEach(function (model) {
	module.exports[model] = require('./' + model);
})