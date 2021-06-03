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

router.post("/user-signup.ajax", async function(req,res){
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var phoneNum = req.body.ph;
    var passport = req.body.passport;
    var email = req.body.Email;
    var password = req.body.Psw;
    const passwordHash = await argon2.hash(password);

    console.log(passwordHash);

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
             console.log(err);
             res.sendStatus(500);
             return;
         }
         console.log("RECORD ADDED!");
         req.pool.getConnection(function(err,connection){
              if(err){
                  console.log(err);
                  res.sendStatus(500);
                  return;
              }

              var query2 = " INSERT INTO Security (user,password,accountType) VALUES ('" + email + "','" + passwordHash + "','user');";
              connection.query(query2, function(err, results){
                 connection.release();
                 if(err){
                     console.log(err);
                     res.sendStatus(500);
                     return;
                 }
                 console.log("RECORD ADDED!");
                 res.redirect('/login.html');
              });
           });
      });
   });


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
