var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var session = require('express-session');
const argon2 = require('argon2');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'covidTraceDB'
});


var app = express();

app.use(function(req,res,next){
   req.pool = dbConnectionPool;
   next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'covid contact tracing webapp',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

var prev = "";

app.use(async function(req,res,next){
    console.log(req.session.user);
   if((req.path == "/dashboard.html" || req.path == "/historyMapView.html") && req.session.user == undefined){
       res.redirect('login.html');
   } else { next(); }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
