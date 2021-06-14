var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var session = require('express-session');
const argon2 = require('argon2');
const cron = require('node-cron');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    proxy: 'http://194.195.253.34',
    auth: {
        user: 'akeem30@ethereal.email',
        pass: 'ss6eazp91u4cY5H6tg'
    },
    tls: {
      rejectUnauthorized: false
    }
});

var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'covidTraceDB'
});

//Function copied straight from StackOverflow.
//The function is the javascript implementation of the Haversine formula.
function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function queryDatabase(req, res, next, query, finish){
    //Function to minimize repetition of code. This function is enough for most database queries that are not complex.

    req.pool.getConnection(function(err,connection){
      if(err){
          console.log(err);
          res.status(500);
          return;
      }

      //Since this function is re-useable within a single route, we have to make sure headers havent already been sent.
      //Usually if headers are sent it is because of errors
      if(res.headersSent){return;}

      connection.query(query, function(err, rows, fields){
         connection.release();

        //Another header check just to be safe
         if(res.headersSent){return;}

         if(err){
             console.log(err);
             res.sendStatus(500);
             return;
         }
         //We only send the result to res.json if the caller asked for it. Otherwise, we do nothing,
         //This is useful for entering data in multiple tables.
         if(finish){
             res.json(rows);
         }
      });
   });
}

//Uncomment for Testin
// var ran = false;

//Scheduling a job to run on Monday (1) at 10am (10) and minute (0) of every week. Set to * * * * * for testing
cron.schedule('0 10 * * 1', function() {
    //Uncomment for testing
    // if(ran){
    //   return;
    // }
    // ran = true;
    // console.log("RAN");
    //~Uncomment for testing

    //Clean up hotspots older than two weeks
    queryDatabase({pool: dbConnectionPool},{sendStatus: console.log},{},"DELETE FROM Hotspots WHERE dateAdded < CURRENT_TIMESTAMP() - INTERVAL 2 WEEK;",false);

    //Code from delete-hotspot.ajax Have to update every venue's hotspot status.
    //a fake res.json function to run on the database results from queryDatabase();
    var fake = function(venues){

          var fake2 = function(hotspots){
              //Go through every venue that is currently a hotspot. Compare its distance to hotspots and if there
              //are no hotspots within a 1km radius, update the row for that query to change its hotspot status.

              //toChange is the list of hotspots that need to be updated
              var toChange = [];

              venues.filter(venue => venue.isHotspot === 1).forEach(function(venue){
                  //Flag represents if it needs to be updated
                 var flag = true;
                 hotspots.forEach(function(hotspot){
                     if(getDistance(venue.lat,venue.lng,hotspot.lat,hotspot.lng) <= 1){
                         //If there are any hotspots within a 1km radius, set flag to false (dont add to toChange)
                         flag = false;
                     }
                 });
                 if(flag){toChange.push(venue.email);}
              });

              //Only update database if there are rows to update. Can't update nothing.
              if(toChange.length > 0){
                  var query = toChange.reduce((total,val) => total + "'" + val + "', ","");
                  query = query.slice(0,query.length-2);

                  queryDatabase({pool: dbConnectionPool},{sendStatus: console.log},{},"UPDATE VenueOwner SET isHotspot = 0 WHERE email IN (" + query + ");",false);
              }

          };

          queryDatabase({pool: dbConnectionPool},{json: fake2, sendStatus: console.log},{},"SELECT * FROM Hotspots",true);
      };
                                             //Fake res object with json property set to fake function.         true because we want fake to be run.
      queryDatabase({pool: dbConnectionPool},{json: fake, sendStatus: console.log},{},"SELECT * FROM VenueOwner",true);


      //Called with list of hotspots that were made in the past week
      var fake3 = function(results){
          if(results.length > 0){
              //Combine list of hotspots for email.
              var formatted = results.reduce((acc,val) => acc += val.street + ", " + val.zipCode + ", " + val.city + ", " + val.country + "\n", "");

              //Email each user (who has signed up for this email category) about these hotspots.
              var fake4 = function(results2){
                  var sent = [];
                 results2.forEach(function(user){
                    if(!sent.includes(user.email)){
                        sent.push(user.email);

                        var mailOptions = {
                          from: 'noreply@wdc-project.com',
                          to: user.email,
                          subject: 'Weekly Hotspot Summary',
                          text: "Here is your summary of hotspots in the previous week:\n\n" + formatted + "\nEnsure you do not visit these areas in the next few weeks. You can unsubscribe from these emails from your dashboard."
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                          if (error) {
                            console.log(error);
                          } else {
                            console.log('Email sent: ' + info.response);
                          }
                        });
                    }
                 });
              };

              queryDatabase({pool: dbConnectionPool},{json: fake4, sendStatus: console.log},{},"SELECT email FROM BasicUser WHERE weeklyHotspotNoti = 1",true);

          }
      };

      queryDatabase({pool: dbConnectionPool},{json: fake3, sendStatus: console.log},{},"SELECT street, zipCode, city, country FROM Hotspots WHERE dateAdded > CURRENT_TIMESTAMP() - INTERVAL 1 WEEK;",true);

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

//Setting up sessions for our website because it'd hell without it.
app.use(session({
    secret: 'covid contact tracing webapp',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

//Middleware to handle authorization.
// Only logged in users can access dashboard.html and historyMapView.html
// Only users can access historyMapView.html. Not admins or VenueOwners.
// Only NOT logged in users can acces login, signup and OID signup.
app.use(function(req,res,next){
   if((req.path == "/dashboard.html" || req.path == "/historyMapView.html") && req.session.user == undefined){
       res.redirect('/login.html');
   } else if (req.path == "/historyMapView.html" && req.session.accountType !== "user"){
       res.redirect('/');
   } else if ((req.path == "/login.html" || req.path == "/signup.html" || req.path == "/signupOID.html") && req.session.user !== undefined ){
       res.redirect("/");
   } else { next(); }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
