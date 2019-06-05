require('dotenv').config();

const express = require('express');
const app = express();
const Bluebird = require('bluebird');
var Connection = require('tedious').Connection;
Bluebird.promisify(require('tedious').Request);
const _ = require('lodash');

let PORT = process.env.PORT | 54102;


var db_config = {
    server: "cs361project.database.windows.net",
    options: {
        encrypt: true,
        database: "CS361_PROJECT"
    },
    authentication: {
        type: "default",
        options: {
            userName: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
        }
    }
};

var connection = new Connection(db_config);

app.post('/auth/login_signup', (req, res) => {
    Bluebird.try(() => {
        if (req.body && !_.isNull(req.body.id) && _.isNumber(+req.body.id)
            && !_.isNull(req.body.full_name) && _.isString(req.body.full_name)
            && !_.isNull(rwq.body.email) && +_.isString(req.body.email)
        ) {
            request = new Request.call("select * from [dbo].[cs361_project]");
            connection.execSql(request);
            return request;
        } else {
            throw new Error("Malformed post");
        }
    }).then((rowCount, rows) => {
        console.log(rowCount + ' rows');
        console.log(rows);
        res.json(rows);
    }).catch((err) => {
        console.log(err);
        res.status(401);
        res.send("error");
    }).finally(() => {
    })
});

connection.on('connect', function (err) {
    if (err) {
        console.log("FATAL: Failed to connect: " + err);
        process.exit(1);
    } else {
        console.log("Connected to database.");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
});
