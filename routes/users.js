var express = require('express');
var argon2 = require('argon2');
var router = express.Router();

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


const CLIENT_ID = '643500159151-uku04glmj95iqbq33mjq69pltc56lfiu.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

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

//Algorithm to generate a unique check-in code for a venue.
//We want to not only make a unique code, but also a code that is visually similar to the business name.
//So instead of 21987623 we want MCDNLD9860
//Code consists of 2 segments. Text (MCDNL) and number (9860) totally 10 characters.
function generateCheckInCode(email,bName){
    //We remove any vowels from the business name.
    var excludeCharacters = ['.',' ',',','A','E','I','O','U'];

    //Slice the email up to the @
    email = email.slice(0,email.indexOf("@")).split('');

    //strip the business name to just consonants
    bName =  bName.toUpperCase().split('').filter(val => /[A-Z]/);
    var strippedName = bName.filter(val => !excludeCharacters.includes(val));

    //If it ends up too short, revert to original name.
    if(strippedName.length <= 3){
        strippedName = bName;
    }

    //Randomly choose the size of text segment (3 to 6)
    var size = Math.floor(Math.random() * 4) + 3;

    //Slice the to the random size. If length is lower than random size then slice all the way.
    var part1 = strippedName.slice(0,Math.min(size,strippedName.length));
    part1 = part1.reduce((acc,val) => acc += val);

    //Number segment's size is whatever is left of 10 characters.
    var part2Size = 10 - part1.length;
    //Number segment is calculated by multiplying the ascii value of each letter of the email.
    //Then modulus by 10^n where n is the length we need.
    var hash = email.map(val => val.charCodeAt(0)).reduce((acc,val) => acc *= val, 1);
    hash = hash % (Math.pow(10,part2Size));
    return part1 + hash.toString();
}

//Generating a reset code for forgotten passwords. Calculated using email so the
//chances of two reset codes being the same is nex to none
function generateResetCode(email){
    email = email.slice(0,email.indexOf("@")).split('');
    var code = email.map(val => val.charCodeAt(0)).reduce((acc,val) => acc *= val, 1);
    code = code * (Math.floor(Math.random() * 100) + 1);
    code = code % (Math.pow(10,6));
    return code;
}

//Function copied straight from StackOverflow.
//Calculates the distance between two pairs of long lat coordinates using Harvensine Formula.
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

//Helper function for getDistance()
function deg2rad(deg) {
  return deg * (Math.PI/180)
}

router.post("/sendResetCode.ajax", function(req,res,next){
   if(req.body.email){

       var fake = function(result){
            if(result.length > 0){
                var code = generateResetCode(req.body.email);
                var mailOptions = {
                  from: 'noreply@wdc-project.com',
                  to: req.body.email,
                  subject: 'You requested a password reset.',
                  text: "Your reset code is: \n"+ code
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
                req.session.resetEmail = req.body.email;
                req.session.resetCode = code;
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
       }

       queryDatabase(req,{json: fake},next,"SELECT user FROM Security WHERE user = '" + req.body.email + "';",true);


   } else {
       res.sendStatus(401);
   }


});


router.post('/resetPassword.ajax', async function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;
    const passwordHash = await argon2.hash(password);
   if(req.body.resetCode !== undefined && req.session.resetCode !== undefined){
       if(req.body.resetCode === req.session.resetCode.toString() && email === req.session.resetEmail){
           queryDatabase(req,res,next,"UPDATE Security SET password = '" + passwordHash + "' WHERE user = '" + email + "';",true);
       } else {
           res.sendStatus(401);
       }
   } else {
       res.sendStatus(401);
   }
});

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

router.post('/tokenLogin.ajax', async function(req,res,next){

    if('idtoken' in req.body){

        try{
            const ticket = await client.verifyIdToken({
            idToken: req.body.idtoken,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            const email = payload['email'];

            var fake = {
                json: function(result){
                    if(result.length > 0){
                        req.session.OpenID = true;
                        req.session.user = email;
                        req.session.accountType = result[0].accountType;
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(404);
                    }
                }
            }
           queryDatabase(req,fake,next,"SELECT DISTINCT * FROM Security WHERE user = '" + email + "';",true);
        } catch(err){
            res.sendStatus(401);
        }


    } else {
        res.sendStatus(401);
    }

});

router.post('/login.ajax', function(req,res,next){

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
                  res.sendStatus(401);
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

router.get('/logout.ajax', function(req,res,next){
    Object.keys(req.session).forEach((key) => (key !== "cookie") && (delete req.session[key]));
    res.sendStatus(200);
});


router.post("/token-user-signup.ajax", async function(req,res,next){

    if('idtoken' in req.body){
        try{
            const ticket = await client.verifyIdToken({
            idToken: req.body.idtoken,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();

            const email = payload['email'];
            var firstName = payload["given_name"];
            var lastName = payload["family_name"];

            var phoneNum = req.body.phoneNum;
            var passport = req.body.passport;

            req.pool.getConnection(function(err,connection){
              if(err){
                  console.log(err);
                  res.sendStatus(500);
                  return;
              }
              var query1 = "INSERT INTO Security (user,password,accountType) VALUES ('" + email + "', ' ' ,'user');";
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

                         req.session.user = email;
                         req.session.accountType = "user";
                         res.sendStatus(200);
                         return;
                      });
                   });

                 } else {
                     req.session.user = email;
                     req.session.accountType = "user";
                     res.sendStatus(200);
                    return;
                 }
              });
           });
        } catch(err){
            res.sendStatus(401)
        }



    } else {
        res.sendStatus(401);
    }



});

router.post("/user-signup.ajax", async function(req,res,next){
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

                 res.sendStatus(200);
                 return;
              });
           });

         } else {
            res.sendStatus(200);
            return;
         }
      });
   });


});

router.post("/token-venue-signup.ajax", async function(req,res,next){

    if("idtoken" in req.body){
        try{
            const ticket = await client.verifyIdToken({
            idToken: req.body.idtoken,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();

            const email = payload['email'];
            var firstName = payload["given_name"];
            var lastName = payload["family_name"];

            if(firstName === undefined){firstName = " ";}
            if(lastName === undefined){lastName = " ";}

            var phoneNum = req.body.phoneNum;
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
              var query1 = "INSERT INTO Security (user,password,accountType) VALUES ('" + email + "', ' ' ,'venue');";
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
                     req.session.user = email;
                    req.session.accountType = "venue";
                    res.sendStatus(200);
                    return;
                 }
              });
          });
        } catch(err){
            res.sendStatus(401);
        }

    } else {
        res.sendStatus(401);
    }




});

router.post("/venue-signup.ajax", async function(req,res,next){
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
            res.sendStatus(200);
            return;
         }
      });
  });


});



router.get('/check-in-codes.ajax', function(req,res,next){
    queryDatabase(req,res,next,"SELECT email, checkInCode FROM VenueOwner;", true);
});

router.post('/check-in.ajax', function(req,res,next){

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
        } else {
            queryDatabase(req,res,next,"INSERT INTO CheckIn (user,venue) VALUES ('" + req.session.user + "', '" + venue + "');", true);
        }


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

                      var query2 = "SELECT user FROM Security WHERE user = '" + email + "';";
                      connection.query(query2, function(err, results){
                         connection.release();
                         if(err){
                             console.log(err);
                             res.sendStatus(500);
                             return;
                         }

                         if(results.length == 0){

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

                         } else {
                             return;
                         }
                      });
                   });

             }
             return;
          });
       });


       var query3 = "INSERT INTO CheckIn (user, venue) VALUES ('" + email + "' , '" + venue + "');";

       queryDatabase(req,res,next,query3, true);


    }

});

router.use(function(req,res,next){
   if(req.session.user){
       next();
   } else {
       res.sendStatus(401);
   }
});


router.post('/updateInfo.ajax', function(req,res,next){
    if(req.session.user !== req.body.email && req.session.accountType !== "admin"){
        res.sendStatus(401);
    } else {
        var toChange = Object.keys(req.body).filter(val => val !== "email" && val !== "accountType" && val !== "lat" && val !== "lng");
        toChange.forEach(val => req.session[val] = req.body[val]);

        var query2 = "";
        toChange.forEach(function(column){
           query2 += column + " = '"  + req.body[column] + "', ";
        });
        query2 = query2.slice(0,query2.length-2);

        if(req.body.accountType === "venue"){
            query2 += ", lat = " + req.body.lat;
            query2 += ", lng = " + req.body.lng;
        }

        var table = "BasicUser";
        if(req.body.accountType === "venue"){table = "VenueOwner";}
        else if(req.body.accountType == "admin"){table = "Admin";}

        queryDatabase(req,res,next,"UPDATE " + table + " SET " + query2 + " WHERE email = '" + req.body.email + "';", true);

    }

});

router.get('/mapHistory.ajax', function(req,res,next){
   if(req.session.accountType !== "user"){
       res.sendStatus(401);
   } else {
       queryDatabase(req,res,next,"SELECT lng,lat FROM CheckIn INNER JOIN VenueOwner ON CheckIn.venue = VenueOwner.email WHERE user = '" + req.session.user + "';", true);
   }
});

router.get('/venueAddress.ajax', function(req,res,next){
   if(req.session.accountType !== "venue" ){
       res.sendStatus(401);
   } else {
       queryDatabase(req,res,next,"SELECT DISTINCT buildingName,streetName,zipCode,city,country FROM Address WHERE venue = '" + req.session.user + "';", true);
   }
});

router.post('/update-venueAddress.ajax', function(req,res,next){

    var query2 = "";
    var toChange = Object.keys(req.body).filter(val => val !== "venue" && val !== "lng" && val !== "lat");
    toChange.forEach(function(column){
       query2 += column + " = '"  + req.body[column] + "', ";
    });
    query2 = query2.slice(0,query2.length-2);
    req.pool.getConnection(function(err,connection){
          if(err){
              res.sendStatus(500);
              return;
          }

          var query = "UPDATE Address SET " + query2 + " WHERE venue = '" + req.body.venue + "';";
          connection.query(query, function(err, rows, fields){
             connection.release();
             if(err){
                 console.log(err)
                 res.sendStatus(500);
                 return;
             }
             return;
          });
    });

     req.pool.getConnection(function(err,connection){
          if(err){
              console.log(err)
              res.sendStatus(500);
              return;
          }

          var query = "UPDATE VenueOwner SET lat = " + req.body.lat + ", lng = " + req.body.lng + " WHERE email = '" + req.body.venue + "';";
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
});




router.get('/venueHistory.ajax', function(req,res,next){
    if(req.session.accountType !== "venue"){
       res.sendStatus(401);
   } else {
       queryDatabase(req,res,next,"SELECT firstName,lastName,phoneNum,time FROM CheckIn INNER JOIN BasicUser ON CheckIn.user = BasicUser.email WHERE venue = '" + req.session.user + "' ORDER BY time DESC;", true);
   }
});

router.get('/:user/checkInHistory.ajax', function(req,res,next){
    if(req.session.user !== req.params.user){
        res.sendStatus(401);
    } else {
        queryDatabase(req,res,next,"SELECT checkInCode,businessName,phoneNum,time,isHotspot FROM CheckIn INNER JOIN VenueOwner ON CheckIn.venue = VenueOwner.email WHERE user = '" + req.params.user + "' ORDER BY time DESC;", true);
    }

});

router.post('/:user/updateEmailPref.ajax', function(req,res,next){
    if(req.session.user !== req.params.user){
        res.sendStatus(401);
    } else {
        req.session.weeklyHotspotNoti = Number(req.body.weeklyNotifications);
        req.session.venueHotspotNoti = Number(req.body.visitedHotspot);
        queryDatabase(req,res,next,"UPDATE BasicUser SET weeklyHotspotNoti = " + Number(req.body.weeklyNotifications) + ", venueHotspotNoti = " + Number(req.body.visitedHotspot) + " WHERE email = '" + req.session.user + "';",true);

    }
});

router.use(function(req,res,next){
   if(req.session.accountType !== "admin"){
       res.sendStatus(401);
   } else {
       next();
   }
});

router.get('/:venueEmail/venueAddress.ajax', function(req,res,next){
    queryDatabase(req,res,next,"SELECT DISTINCT buildingName,streetName,zipCode,city,country FROM Address WHERE venue = '" + req.params.venueEmail + "';", true);
});

router.get('/user-details.ajax', function(req,res,next){
    queryDatabase(req,res,next,"SELECT * FROM BasicUser;", true);
});

router.get('/venue-details.ajax', function(req,res,next){
    queryDatabase(req,res,next,"SELECT * FROM VenueOwner;", true);
});

router.post("/admin-signup.ajax", async function(req,res,next){
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

router.post("/add-hotspot.ajax", function(req,res,next){
   var id = req.body.id;
   var creator = req.body.creator;
   var street = req.body.street;
   var zipCode = req.body.zipCode;
   var city = req.body.city;
   var country = req.body.country;
   var lng = req.body.lng;
   var lat = req.body.lat;

   queryDatabase(req,res,next,"INSERT INTO Hotspots (creator,street,zipCode,city,country,lat,lng) VALUES ('" + creator + "', '" + street + "', '" + zipCode + "', '" + city + "', '" + country + "', " + lat + ", " + lng + ");", false);

    var fake = function(result){
        result.forEach(row => row.distanceToHS = getDistance(lat,lng,row.lat,row.lng));

        var affected = result.filter(row => row.distanceToHS <= 1);
        var affectedVenues = affected.map(row => row.email);

        var fake2 = function(result2){
            var sent = []
            result2.forEach(function(row){
                if(!sent.includes(row.user)){
                    sent.push(row.user);
                    var mailOptions = {
                      from: 'noreply@wdc-project.com',
                      to: row.user,
                      subject: 'You have been to a Hotspot recently.',
                      text: "You have recently visited a venue which is now withing 1km of " + street + " . This location has been declared a COVID-19 HOTSPOT. Please seek medical attention. You can unsubscribe from these emails in the dashboard."
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

        }

        if(affectedVenues.length > 0){
            var query = affectedVenues.reduce((total,val) => total + "'" + val + "', ","");
            query = query.slice(0,query.length-2);

            if(query.length)

            queryDatabase(req,{json: fake2},next,"SELECT user FROM CheckIn INNER JOIN BasicUser ON CheckIn.user = BasicUser.email WHERE venue IN (" + query + ") AND BasicUser.venueHotspotNoti = 1 AND CheckIn.time > CURRENT_TIMESTAMP() - INTERVAL 2 WEEK;",true);

            queryDatabase(req,res,next,"UPDATE VenueOwner SET isHotspot = 1 WHERE email IN (" + query + ");",true);
        }

    }

    queryDatabase(req,{json: fake},next,"SELECT * FROM VenueOwner",true);



});

router.post("/update-hotspot.ajax", function(req,res,next){
   var id = req.body.id;

   var exclude = ["id","creator","lng","lat","dateAdded"];
   var toChange = Object.keys(req.body).filter(key => !exclude.includes(key));

    var query2 = "";
        toChange.forEach(function(column){
           query2 += column + " = '"  + req.body[column] + "', ";
        });
        query2 = query2.slice(0,query2.length-2);
    query2 += ",lng = " + req.body.lng;
    query2 += " , lat = " + req.body.lat;

  queryDatabase(req,res,next,"UPDATE Hotspots SET " + query2 + " WHERE id = " + id + " ;", true);



});

router.post('/delete-hotspot.ajax', function(req,res,next){
    var id = req.body.id;

  queryDatabase(req,res,next,"DELETE FROM Hotspots WHERE id = '" + id + "';", false);

  var fake = function(venues){

      var fake2 = function(hotspots){
          var toChange = [];

          venues.filter(venue => venue.isHotspot === 1).forEach(function(venue){
             var flag = true;
             hotspots.filter(hotspot => hotspot.id !== id).forEach(function(hotspot){

                 if(getDistance(venue.lat,venue.lng,hotspot.lat,hotspot.lng) <= 1){
                     flag = false;
                 }
             });
             if(flag){toChange.push(venue.email);}
          });

          if(toChange.length > 0){
              var query = toChange.reduce((total,val) => total + "'" + val + "', ","");
              query = query.slice(0,query.length-2);

              queryDatabase(req,res,next,"UPDATE VenueOwner SET isHotspot = 0 WHERE email IN (" + query + ");",true);
          } else {
              res.sendStatus(200);
          }

      }

      queryDatabase(req,{json: fake2},next,"SELECT * FROM Hotspots",true);
  }

  queryDatabase(req,{json: fake},next,"SELECT * FROM VenueOwner",true);


});

router.post('/delete-venue.ajax', function(req,res,next){
    var email = req.body.email;

  queryDatabase(req,res,next,"DELETE FROM CheckIn WHERE venue = '" + email + "';", false);
  queryDatabase(req,res,next,"DELETE FROM Address WHERE venue = '" + email + "';", false);
  queryDatabase(req,res,next,"DELETE FROM VenueOwner WHERE email = '" + email + "';", false);
  queryDatabase(req,res,next,"DELETE FROM Security WHERE user = '" + email + "';", true);

});

router.post('/delete-user.ajax', function(req,res,next){
    var email = req.body.email;

  queryDatabase(req,res,next,"DELETE FROM CheckIn WHERE user = '" + email + "';", false);
  queryDatabase(req,res,next,"DELETE FROM BasicUser WHERE email = '" + email + "';", false);
  queryDatabase(req,res,next,"DELETE FROM Security WHERE user = '" + email + "';", true);
});


module.exports = router;

