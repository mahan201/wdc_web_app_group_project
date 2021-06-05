var express = require('express');
var argon2 = require('argon2');
var router = express.Router();

function queryDatabase(req, res, next, query){
    req.pool.getConnection(function(err,connection){
      if(err){
          console.log(err);
          res.sendStatus(500);
          return;
      }

      connection.query(query, function(err, rows, fields){
         connection.release();
         if(err){
             console.log(err);
             res.sendStatus(500);
             return;
         }
         res.json(rows);
      });
   });
}

function generateCheckInCode(email,bName){
    var excludeCharacters = ['.',' ',',','A','E','I','O','U'];
    email = email.slice(0,email.indexOf("@")).split('');
    bName =  bName.toUpperCase().split('').filter(val => /[A-Z]/);
    var strippedName = bName.filter(val => !excludeCharacters.includes(val));

    if(strippedName.length <= 3){
        //Revert back. Stripped version is too short.
        strippedName = bName;
    }

    var size = Math.floor(Math.random() * 4) + 3;

    var part1 = strippedName.slice(0,Math.min(size,strippedName.length));
    part1 = part1.reduce((acc,val) => acc += val);

    var part2Size = 10 - part1.length;
    var hash = email.map(val => val.charCodeAt(0)).reduce((acc,val) => acc *= val, 1);
    hash = hash % (Math.pow(10,part2Size));
    return part1 + hash.toString();
}

router.get('/details.ajax', function(req,res,next){
    var obj = {loggedIn: false};
    if(req.session.user){
        obj.loggedIn = true;
        if(req.session.rest === undefined){
            //This is for when req.session doesnt have the extra properties such as first name. last name etc (custom for each type).
            var table = "BasicUser";
            if (req.session.accountType === "venue"){table = "VenueOwner";}
            else if (req.session.accountType === "admin"){table = "Admin";}

            var excludes = ["email","lat","lng"];

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

      if(res.headersSent){return;}

      var query2 = "INSERT INTO BasicUser VALUES ('" + email + "','" + firstName + "','" + lastName + "','" + phoneNum + "','" + passport + "',1,1);";
      connection.query(query2, function(err, results){
         connection.release();

         if(res.headersSent){return;}

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

              if(res.headersSent){return;}

              var query3 = "UPDATE BasicUser SET firstName = '" + firstName + "', lastName = '" + lastName + "', phoneNum = '" + phoneNum + "', icPsprt = '" + passport + "' WHERE email = '" + email + "';";
              connection.query(query3, function(err, results){
                 connection.release();

                 if(res.headersSent){return;}

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

router.post("/venue-signup.ajax", async function(req,res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phoneNum = req.body.phoneNum;
    var email = req.body.email;
    var password = req.body.password;
    const passwordHash = await argon2.hash(password);
    var companyName = req.body.companyName;
    var buildingName = req.body.buildingName;
    var street = req.body.street;
    var zipCode = req.body.zipCode;
    var city = req.body.city;
    var country = req.body.country;
    var checkInCode = generateCheckInCode(email,companyName);
    var lng = req.body.lng;
    var lat = req.body.lat;


    req.pool.getConnection(function(err,connection){
      if(err){
          console.log(err);
          res.sendStatus(500);
          return;
      }
      var query1 = "INSERT INTO Security (user,password,accountType) VALUES ('" + email + "','" + passwordHash + "','venue');";
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

      if(res.headersSent){return;}

      var query2 = "INSERT INTO VenueOwner VALUES ('" + email + "','" + firstName + "','" + lastName + "','" + phoneNum + "','" + companyName  + "','" + checkInCode + "'," + lat.toString() + "," + lng.toString() + ", 0);";
      connection.query(query2, function(err, results){
         connection.release();

         if(res.headersSent){return;}

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

      if(res.headersSent){return;}

      var query3 = "INSERT INTO Address (venue,buildingName,streetName,zipCode,city,country) VALUES ('" + email + "','" + buildingName + "','" + street + "','" + zipCode+ "','" + city  + "','" + country + "');";
      connection.query(query3, function(err, results){
         connection.release();

         if(res.headersSent){return;}

         if(err){
             if(err.code === "ER_DUP_ENTRY"){
                 //We want to differentiate this from other server errors so that the client knows the user is trying to sign up with an existing email.
                 res.sendStatus(400);
                 return;
             }
             res.sendStatus(500);
             return;

         } else {
            res.redirect('/login.html');
            return;
         }
      });
  });


});

router.post("/admin-signup.ajax", async function(req,res){
    if(req.session.accountType !== "admin"){
        res.sendStatus(401);
        return;
    }
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    const passwordHash = await argon2.hash(password);


    req.pool.getConnection(function(err,connection){
      if(err){
          console.log(err);
          res.sendStatus(500);
          return;
      }
      var query1 = "INSERT INTO Security (user,password,accountType) VALUES ('" + email + "','" + passwordHash + "','admin');";
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

      if(res.headersSent){return;}

      var query2 = "INSERT INTO Admin VALUES ('" + email + "','" + firstName + "','" + lastName + "');";
      connection.query(query2, function(err, results){
         connection.release();

         if(res.headersSent){return;}

         if(err){
             if(err.code === "ER_DUP_ENTRY"){
                 //We want to differentiate this from other server errors so that the client knows the user is trying to sign up with an existing email.
                 res.sendStatus(400);
                 return;
             }
             res.sendStatus(500);
             return;

         }
         res.sendStatus(200);
         return;
      });
  });


});


router.get('/check-in-codes.ajax', function(req,res,next){
    queryDatabase(req,res,next,"SELECT email, checkInCode FROM VenueOwner;");
});

router.post('/check-in.ajax', function(req,res){

    var venue = req.body.venue;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phoneNum = req.body.phoneNum;
    var passport = req.body.passport;

    console.log(req.body);

    if(req.session.user && req.session.accountType === "user"){
        //SIGNED IN USER;
        if(venue === undefined){
            res.sendStatus(400);
            return;
        }

        req.pool.getConnection(function(err,connection){
          if(err){
              console.log(err)
              res.sendStatus(500);
              return;
          }

          var query = "INSERT INTO CheckIn (user,venue) VALUES ('" + req.session.user + "', '" + venue + "');";
          connection.query(query, function(err, rows, fields){
             connection.release();
             if(err){
                 console.log(err)
                 res.sendStatus(500);
                 return;
             }
             res.sendStatus(200);
             return;
          });
       });

    } else {
        //NOT SIGNED IN USER;
         if (venue === undefined || email === undefined || firstName === undefined || lastName === undefined || phoneNum === undefined || passport === undefined){
             res.sendStatus(400);
         }

         req.pool.getConnection(function(err,connection){
          if(err){
              console.log(err)
              console.log(err);
              res.sendStatus(500);
              return;
          }

          var query1 = "INSERT INTO BasicUser VALUES ('" + email + "','" + firstName + "','" + lastName + "','" + phoneNum + "','" + passport + "',1,1);";
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

router.post('/updateInfo.ajax', function(req,res,next){
    if(req.session.user !== req.body.user){
        res.sendStatus(401);
    } else {
        var toChange = Object.keys(req.body).filter(val => val !== "user");
        toChange.forEach(val => req.session[val] = req.body[val]);

        var query2 = "";
        toChange.forEach(function(column){
           query2 += column + " = '"  + req.body[column] + "', ";
        });
        query2 = query2.slice(0,query2.length-2);

        var table = "BasicUser";
        if(req.session.accountType === "venue"){table = "VenueOwner";}
        else if(req.session.accountType == "admin"){table = "Admin";}

        queryDatabase(req,res,next,"UPDATE " + table + " SET " + query2 + " WHERE email = '" + req.session.user + "';");

    }

});

router.get('/mapHistory.ajax', function(req,res,next){
   if(req.session.accountType !== "user"){
       res.sendStatus(401);
   } else {
       queryDatabase(req,res,next,"SELECT lng,lat FROM CheckIn INNER JOIN VenueOwner ON CheckIn.venue = VenueOwner.email WHERE user = '" + req.session.user + "';");
   }
});

router.get('/venueAddress.ajax', function(req,res,next){
   if(req.session.accountType !== "venue"){
       res.sendStatus(401);
   } else {
       queryDatabase(req,res,next,"SELECT DISTINCT buildingName,streetName,zipCode,city,country FROM Address WHERE venue = '" + req.session.user + "';");
   }
});

router.get('/venueHistory.ajax', function(req,res,next){
   if(req.session.accountType !== "venue"){
       res.sendStatus(401);
   } else {
       queryDatabase(req,res,next,"SELECT firstName,lastName,phoneNum,time FROM CheckIn INNER JOIN BasicUser ON CheckIn.user = BasicUser.email WHERE venue = '" + req.session.user + "' ORDER BY time DESC;");
   }
});

router.get('/:user/checkInHistory.ajax', function(req,res,next){
    if(req.session.user !== req.params.user){
        res.sendStatus(401);
    } else {
        queryDatabase(req,res,next,"SELECT checkInCode,businessName,phoneNum,time,isHotspot FROM CheckIn INNER JOIN VenueOwner ON CheckIn.venue = VenueOwner.email WHERE user = '" + req.params.user + "' ORDER BY time DESC;");
    }

});

router.post('/:user/updateEmailPref.ajax', function(req,res,next){
    if(req.session.user !== req.params.user){
        res.sendStatus(401);
    } else {
        req.session.weeklyHotspotNoti = Number(req.body.weeklyNotifications);
        req.session.venueHotspotNoti = Number(req.body.visitedHotspot);
        queryDatabase(req,res,next,"UPDATE BasicUser SET weeklyHotspotNoti = " + Number(req.body.weeklyNotifications) + ", venueHotspotNoti = " + Number(req.body.visitedHotspot) + " WHERE email = '" + req.session.user + "';");

    }
});

module.exports = router;
