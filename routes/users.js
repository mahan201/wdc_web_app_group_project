var express = require('express');
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
