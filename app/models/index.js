[
	'User',
].forEach(function (model) {
	module.exports[model] = require('./' + model);
})