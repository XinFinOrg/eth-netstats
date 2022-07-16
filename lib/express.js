var express = require('express');
var cors = require('cors');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const routes = require("./routes")


app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, (process.env.LITE === 'true' ? '../src-lite/views' : '../src/views')));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, (process.env.LITE === 'true' ? '../dist-lite' : '../dist'))));
app.get('/', function(req, res) {
  res.render('index');
});

// Attach custom routers
app.use("/v2", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
});

// production error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;