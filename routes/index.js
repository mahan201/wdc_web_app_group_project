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
    var headers = ["id","creator","address","zipCode","city","country","lat","lng"];
    if(req.query.columns === undefined){
        queryDatabase(req,res,next,"SELECT * FROM Hotspots ORDER BY dateAdded DESC");
    } else {
        var cols = req.query.columns.split(',');
        var query = "";
        cols.forEach(col => {if(headers.includes(col)) { query += col+"," } } );
        query = query.slice(0,query.length-1);
        queryDatabase(req,res,next,"SELECT " + query + " FROM Hotspots ORDER BY dateAdded DESC;");
    }
});

module.exports = router;
