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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('hotspot-map.html');
});

router.get('/hotspots.ajax', function(req,res,next){
    queryDatabase(req,res,next,"SELECT * FROM Hotspots");
});

module.exports = router;
