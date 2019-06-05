require('dotenv').config();

const express = require('express');
const app = express();
const Bluebird = require('bluebird');
const bodyParser = require('body-parser');
var Connection = require('tedious').Connection;
const Request = Bluebird.promisify(require('tedious').Request);
const _ = require('lodash');

let PORT = process.env.PORT | 54102;


var db_config = {
    server: "cs-361-spring-2019-group-19.database.windows.net", // Dan's instance for fallback: "cs361project.database.windows.net",
    options: {
        encrypt: true,
        database: "social_media_tracking", // Dan's instance for fallback: "CS361_PROJECT"
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

app.use(bodyParser.json());

app.post('/auth/login_signup', (req, res) => {
    console.log(req.body);
    Bluebird.try(() => {
        if (req.body && !_.isNull(req.body.id) && _.isNumber(+req.body.id)
            && !_.isNull(req.body.full_name) && _.isString(req.body.full_name)
            && !_.isNull(req.body.email) && +_.isString(req.body.email)
        ) {
            let request = new Request("select * from [dbo].[cs361_project]");
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
