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
<<<<<<< HEAD
    server: process.env.DB_ADDRESS,
    options: {
        encrypt: true,
        database: process.env.DB_NAME
=======
    server: "cs-361-spring-2019-group-19.database.windows.net", // Dan's instance for fallback: "cs361project.database.windows.net",
    options: {
        encrypt: true,
        database: "social_media_tracking", // Dan's instance for fallback: "CS361_PROJECT"
>>>>>>> e1c54e7807058888e181c09181b6bef9506e14f1
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
    let user = {};
    Bluebird.try(() => {
        if (req.body && !_.isNull(req.body.id) && _.isNumber(+req.body.id)
            && !_.isNull(req.body.full_name) && _.isString(req.body.full_name)
            && !_.isNull(req.body.email) && _.isString(req.body.email)
            && !_.isNull(req.body.token) && _.isString(req.body.token)
        ) {
            let request = new Request(`select * from [dbo].[cs361_project] where id=${req.body.id}`);
            connection.execSql(request);
            return request;
        } else {
            Bluebird.reject("Malformed post");
        }
    }).then((rowCount, rows) => {
        console.log(rowCount + ' rows');
        console.log(rows);
        let query = '';
        if (rowCount == 1) {
            user = rows[0];
            query += `update [dbo].[cs361_project] set user_token=${req.body.token} where id=${req.body.id}`;
        } else if (rowCount == 0) {
            query += `insert into [dbo].[cs361_project] (id, full_name, given_name, image_url, email, id_token) values (${req.body.id}, ${req.body.full_name | 'null'}, ${req.body.given_name | 'null'}, ${req.body.image_url | 'null'}, ${req.body.email | 'null'}, ${req.body.id_token})`
        } else if (rowCount > 1) {
            Bluebird.reject("Too many users");
        }
        let request = new Request(query);
        connection.execSql(request);
        res.json(rows);
    }).then((rowCount, rows) => {
        if (rowCount == 1) {
            res.status(200).send("successfully added/updated user");
        } else {
            res.status(400).send("failed to add/update user, server failure");
        }
    }).catch((err) => {
        console.log(err);
        res.status(401).send(err);
    }).finally(() => {
        res.status(401).send("unknown error");
    });
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