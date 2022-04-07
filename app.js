let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose')

let adminsRouter = require('./routes/admin');
let usersRouter = require('./routes/user');
let busRouter = require('./routes/bus');
let bookingRouter = require('./routes/booking')

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// To create a collection on the mongodb compass
mongoose.connect('mongodb://localhost/bucket', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex: true
}).then(() => {
  console.log("connection successfull")
}).catch((e) => {
  console.log(e)
});

const con = mongoose.connection;
con.on("open", function () {
  console.log("Database connected");
});

app.use('/admin', adminsRouter);
app.use('/user', usersRouter);
app.use('/bus', busRouter);
app.use('/booking', bookingRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
app.listen(2000)
console.log("Listening at port 2000")