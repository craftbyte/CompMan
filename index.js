var express = require('express');
var app = express();

app.set('view engine', 'jade');

app.get('/', (req,res) => {
	res.render('index')
})

app.listen(process.env.PORT||3000, function () {
  console.log('Running on port '+(process.env.PORT||3000));
});