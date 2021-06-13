const cron = require('node-cron');
var express = require('express');
var router = express.Router();

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




/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('check-in.html');
});

//Route that does not interact with any user.
//It is used both for the hotspot map and the hotspot manage list in admin dashboard.
//Route can handle "columns" parameter
//If no columns is provided, we send every column.
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
