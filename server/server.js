const express = require('express')
const app = express()
let PORT = process.env.PORT | 54102


var db_config = {
    server: "cs361project.database.windows.net",
    options: {
        encrypt: true, 
        database: "CS361_PROJECT"
    },
    authentication: {
      type: "default",
      options: {  
        userName: "danrivman@cs361project",
        password: "...",
      }
    }
  };
  
  var Connection = require('tedious').Connection;
  var connection = new Connection(db_config);
  
  var Request = require('tedious').Request;
  request = new Request("select 'hello world'", function(err, rowCount) {
      if (err) {
          console.log(err);
      } else {
          console.log(rowCount + ' rows');
      }
  });
  
  request.on('row', function(columns) { 
      columns.foreach(function(column) {
          console.log(column.value);
      });
  });
  
  // TODO: Bundle this connection logic into a separate file that we can reference as a module, to hide all this junk.
  connection.on('connect', function(err) {
      if (err) {
          console.log("FATAL: Failed to connect: " + err);
          process.exit(1);
      } else {
          console.log("Connected to database.");
          connection.execSql(request);
      }
  });


/*
// START mssql connection attempt
// Here is a connection attempt using the mssql module. Not sure which one is less confusing.

const sql = require('mssql')
 
const config = {
    user: 'danrivman@cs361project',
    password: '...',
    server: 'cs361project.database.windows.net',
    database: 'CS361_PROJECT',
 
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

const pool = new sql.ConnectionPool(config, 
    err => { 
        console.log("FATAL: Failed to create db pool! " + err);
        process.exit(1);
    });

pool.on('error', err => { 
    console.log("Pool error event: " + err);
});

// Seems unnecessary?
pool.connect(err => { 
    console.log("FATAL: Pool connection error: " + err);
    process.exit(1);
});



sql.request().query("select * from dual ", (err, result) => {
    if (err) { 
        console.log("query error: " + err);
    } else { 
        console.log("result: " + result);
    }
});

// END mssql connection attempt
*/


app.listen(PORT)
