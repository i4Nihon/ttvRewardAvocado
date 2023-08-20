const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const crypto = require('crypto');
const  session = require('cookie-session')
const passport = require("passport");

const authRouter = require('./routes/auth');
const addRewardRouter = require('./routes/addReward');
const editRewardRouter = require('./routes/editReward');
const deleteRewardRouter = require('./routes/deleteReward');
const getTokenRouter = require('./routes/getToken');

const app = express();

const secretKey = crypto.randomBytes(32).toString('hex');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Serializacja i deserializacja użytkownika (dla sesji)
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: secretKey, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);
app.use('/addreward', addRewardRouter);
app.use('/editreward', editRewardRouter);
app.use('/deletereward', deleteRewardRouter);
app.use('/gettoken', getTokenRouter)
app.use('/gettoken/redirect', getTokenRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
