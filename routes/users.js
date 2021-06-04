var express = require('express');
var argon2 = require('argon2');
var router = express.Router();

function queryDatabase(req, res, next, query){
    req.pool.getConnection(function(err,connection){
      if(err){
          res.sendStatus(500);
          return;
      }

      connection.query(query, function(err, rows, fields){
         connection.release();
         if(err){
             res.sendStatus(500);
             return;
         }
         res.json(rows);
      });
   });
}

router.get('/details.ajax', function(req,res,next){
    var obj = {loggedIn: false};
    if(req.session.user){
        obj.loggedIn = true;
        if(req.session.rest === undefined){
            var table = "BasicUser";
            if (req.session.accountType === "venue"){table = "VenueOwner";}
            else if (req.session.accountType === "admin"){table = "Admin";}

            var excludes = ["email","lat","lng",];

            req.pool.getConnection(function(err,connection){
              if(err){
                  res.sendStatus(500);
                  return;
              }

              var query = "SELECT DISTINCT * FROM " + table + " WHERE email = '" + req.session.user + "';";
              connection.query(query, function(err, rows, fields){
                 connection.release();
                 if(err){
                     res.sendStatus(500);
                     return;
                 }
                 var row = rows[0];
                 Object.keys(row).forEach((key) => (!excludes.includes(key)) && (req.session[key] = row[key]));
                 req.session.rest = true;
                 Object.keys(req.session).forEach((key) => (key !== "cookie" && key !== "rest") && (obj[key] = req.session[key]));
                 res.json(obj);
              });
           });
        } else {
            Object.keys(req.session).forEach((key) => (key !== "cookie" && key !== "rest") && (obj[key] = req.session[key]));
            res.json(obj);
        }

    } else {
        res.json(obj);
    }

});


router.post('/login.ajax', function(req,res){

    if('email' in req.body && 'password' in req.body){
       var email = req.body.email;
       var password = req.body.password;

       req.pool.getConnection(function(err,connection){
          if(err){
              console.log(err);
              res.sendStatus(500);
              return;
          }

         var query = "SELECT DISTINCT * FROM Security WHERE user = '" + email + "';";
          connection.query(query, async function(err, rows, fields){
             connection.release();
             if(err){
                 console.log(err);
                 res.sendStatus(500);
                 return;
             }

             if(rows.length > 0){
                try {
                  if (await argon2.verify(rows[0].password, password)) {
                    req.session.user = email;
                    req.session.accountType = rows[0].accountType;
                    res.sendStatus(200);
                  } else {
                    res.send(401);
                  }
                } catch (err) {
                  res.sendStatus(500);
                }
             } else {
                 res.sendStatus(401);
             }
          });
       });
    } else {
        res.sendStatus(401);
    }



});

router.get('/logout.ajax', function(req,res){
    Object.keys(req.session).forEach((key) => (key !== "cookie") && (delete req.session[key]));
    console.log(req.session);
    res.redirect("/");
});

router.post("/user-signup.ajax", async function(req,res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phoneNum = req.body.phoneNum;
    var passport = req.body.passport;
    var email = req.body.email;
    var password = req.body.password;
    const passwordHash = await argon2.hash(password);

    req.pool.getConnection(function(err,connection){
      if(err){
          console.log(err);
          res.sendStatus(500);
          return;
      }
      var query1 = "INSERT INTO Security (user,password,accountType) VALUES ('" + email + "','" + passwordHash + "','user');";
      connection.query(query1, function(err, results){
         connection.release();
         if(err){
             if(err.code === "ER_DUP_ENTRY"){
                 //We want to differentiate this from other server errors so that the client knows the user is trying to sign up with an existing email.
                 res.sendStatus(400);
                 return;
             }
             res.sendStatus(500);
             return;
         }
      });
   });


   req.pool.getConnection(function(err,connection){
      if(err){
          console.log(err);
          res.sendStatus(500);
          return;
      }

      var query2 = "INSERT INTO BasicUser VALUES ('" + email + "','" + firstName + "','" + lastName + "','" + phoneNum + "','" + passport + "');";
      connection.query(query2, function(err, results){
         connection.release();
         if(err){
             if(err.code !== "ER_DUP_ENTRY"){
                 res.sendStatus(500);
                 return;
             }

             req.pool.getConnection(function(err,connection){
              if(err){
                  console.log(err);
                  res.sendStatus(500);
                  return;
              }

              var query3 = "UPDATE BasicUser SET firstName = '" + firstName + "', lastName = '" + lastName + "', phoneNum = '" + phoneNum + "', icPsprt = '" + passport + "' WHERE email = '" + email + "';";
              connection.query(query3, function(err, results){
                 connection.release();
                 if(err){
                     res.sendStatus(500);
                     return;
                 }

                 res.redirect('/login.html');
                 return;
              });
           });

         } else {
            res.redirect('/login.html');
            return;
         }
      });
   });


});

router.post('/check-in.ajax', function(req,res){

    var venue = req.body.venue;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phoneNum = req.body.phoneNum;
    var passport = req.body.passport;

    console.log(req.body);

    if(req.session.user){
        //SIGNED IN USER;

    } else {
        //NOT SIGNED IN USER;
         if (venue === undefined || email === undefined || firstName === undefined || lastName === undefined || phoneNum === undefined || passport === undefined){
             res.sendStatus(400);
         }

         req.pool.getConnection(function(err,connection){
          if(err){
              console.log(err);
              res.sendStatus(500);
              return;
          }

          var query1 = "INSERT INTO BasicUser VALUES ('" + email + "','" + firstName + "','" + lastName + "','" + phoneNum + "','" + passport + "');";
          connection.query(query1, function(err, results){
             connection.release();
             if(err){
                 if(err.code !== "ER_DUP_ENTRY"){
                     console.log(err);
                     res.sendStatus(500);
                     return;
                 }
                 req.pool.getConnection(function(err,connection){
                      if(err){
                          console.log(err);
                          res.sendStatus(500);
                          return;
                      }

                      var query2 = "UPDATE BasicUser SET firstName = '" + firstName + "', lastName = '" + lastName + "', phoneNum = '" + phoneNum + "', icPsprt = '" + passport + "' WHERE email = '" + email + "';";
                      connection.query(query2, function(err, results){
                         connection.release();
                         if(err){
                             console.log(err);
                             res.sendStatus(500);
                             return;
                         }
                         return;
                      });
                   });

             }
             return;
          });
       });

       req.pool.getConnection(function(err,connection){
          if(err){
              console.log(err);
              res.sendStatus(500);
              return;
          }

          if(res.headersSent){return;}

          var query3 = "INSERT INTO CheckIn (user, venue) VALUES ('" + email + "' , '" + venue + "');";
          connection.query(query3, function(err, results){
             connection.release();
             if(res.headersSent){return;}
             if(err){
                 console.log(err);
                 res.sendStatus(500);
                 return;
             } else {
                 res.sendStatus(200);
                 return;
             }

          });
       });
    }

});

router.use(function(req,res,next){
   if(req.session.user){
       next();
   } else {
       res.sendStatus(401);
   }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/user-details.ajax', function(req,res,next){
    queryDatabase(req,res,next,"SELECT * FROM BasicUser;");
});

router.get('/check-in.ajax', function(req,res,next){
    queryDatabase(req,res,next,"SELECT * FROM CheckIn");
});

module.exports = router;
