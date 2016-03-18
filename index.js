var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));


app.get('/', (req,res) => {
	res.render('index')
})

app.use((req, res, next) => {
  res.redirect('/');
});

app.listen(process.env.PORT||3000, function () {
  console.log('Running on port '+(process.env.PORT||3000));
});