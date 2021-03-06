const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.set('view cache', true);

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    '/assets',
    express.static(
        path.join(__dirname, '/node_modules/material-dashboard/assets')));

app.use(
    '/scripts',
    express.static(path.join(__dirname, '/node_modules/mathjs/dist/')));

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
}));

app.use(flash());

// globals
app.use(function(req, res, next) {
  res.locals.authenticated = false;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
