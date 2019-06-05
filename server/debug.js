module.exports.with = function(connection) {

    const Bluebird = require('bluebird');
    const Request = require('tedious').Request;
    var express = require('express');
    var router = express.Router();
    var baseRoute = "debug";


    router.get('/', function(req, res) {

        var debug_toc = "<a href='/debug/list-tables'>List tables</a><br><a href='/debug/list-users'>List users</a><br>";
        res.write(debug_toc);
        res.end();
    });


    router.get('/list-tables', function(req, res) {

        var context = { column_listing: undefined, output: "" };

        Bluebird.try(() => {
            let query = " \
            select t.name 'table', c.name 'column' \
            from \
                sys.columns c \
                inner join sys.tables t on c.object_id = t.object_id \
            order by 1, 2";
            let request = new Request(query, (err, rowCount) => {
                if (err) { 
                    console.log("Query error: " + err);
                    // res.status(401);
                    // res.send(err);
                }
                console.log("row count: " + rowCount);
            });

            request.on('row', (columns) => {
                addRow(columns, context);
            });

            request.on('requestCompleted', (rowCount, more, rows) => {
                sendResult(res, context);
            });

            connection.execSql(request);

            
        })
        .catch((err) => {
            console.log("error caught: " + err);
            // res.status(401);
            // res.write(err);
            // res.end();
        })
    
    });


    function addRow(columns, context) { 

        if (context.column_listing == undefined) { 
            context.column_listing = "<tr>";
            columns.forEach( column => {
                context.column_listing += "<th>" + column.metadata.colName + "</th>";
            });
            context.column_listing += "</tr>\n";
        }

        context.output += "<tr>";
        columns.forEach( column => {
            context.output += "<td>" + column.value + "</td>";
        });

        context.output += "</tr>\n";
    };

    function sendResult(res, context) {

        context.output += "</table>";
        res.send("<table border='1px'>" + context.column_listing + context.output);
    };

    
    router.get('/list-users', function(req, res) {

        var context = { column_listing: undefined, output: "" };

        Bluebird.try(() => {
            let query = " \
            select * \
            from \
                cs361_project u \
            order by id";
            let request = new Request(query, (err, rowCount) => {

                if (err) { 
                    console.log("Query error: " + err);
                    res.status(401);
                    // res.send(err);
                }
                console.log("row count: " + rowCount);
            });

            request.on('row', (columns) => {
                addRow(columns, context);
            });

            request.on('requestCompleted', (rowCount, more, rows) => {
                sendResult(res, context);
            });

            connection.execSql(request);

            
        })
        .catch((err) => {
            console.log("error caught: " + err);
            // res.status(401);
            // res.write(err);
            // res.end();
        })
    
    });

    return router;
}
