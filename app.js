var express = require('express');
var app = express();
var fs = require('fs');
var mustache = require('mustache-express');
var expressWs = require('express-ws')(app);

var monitor = require('./controllers/monitor.controller.js');
console.log('test');

console.log('setting up mustache engine...');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

console.log('setting up virtual directories for static content...');
app.use('/public', express.static('public'));

console.log('starting monitoring services...');
app.use('/monitor', monitor);

app.get('/', function(req, res){
  res.render('app', {title: 'Pulsar', message: 'main page'});
});

app.listen(3000, function () {
  console.log('pulsar listening on port 3000.');
});
