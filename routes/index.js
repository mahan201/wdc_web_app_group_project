const cron = require('node-cron');
var express = require('express');
var router = express.Router();

function queryDatabase(req, res, next, query, finish){

    req.pool.getConnection(function(err,connection){
      if(err){
          console.log(err);
          res.status(500);
          return;
      }

      if(res.headersSent){return;}

      connection.query(query, function(err, rows, fields){
         connection.release();

         if(res.headersSent){return;}

         if(err){
             console.log(err);
             res.sendStatus(500);
             return;
         }
         if(finish){
             res.json(rows);
         }
      });
   });
}




/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('check-in.html');
});

router.get('/hotspots.ajax', function(req,res,next){
    var headers = ["id","creator","address","zipCode","city","country","lat","lng"];
    if(req.query.columns === undefined){
        queryDatabase(req,res,next,"SELECT * FROM Hotspots ORDER BY dateAdded DESC",true);
    } else {
        var cols = req.query.columns.split(',');
        var query = "";
        cols.forEach(col => {if(headers.includes(col)) { query += col+"," } } );
        query = query.slice(0,query.length-1);
        queryDatabase(req,res,next,"SELECT " + query + " FROM Hotspots ORDER BY dateAdded DESC;",true);
    }
});

module.exports = router;
