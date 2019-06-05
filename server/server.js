require('dotenv').config();

const express = require('express');
const app = express();
const Bluebird = require('bluebird');
const bodyParser = require('body-parser');
var Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const _ = require('lodash');

let PORT = process.env.PORT | 54102;


var db_config = {
    server: process.env.DB_ADDRESS,
    options: {
        encrypt: true,
        database: process.env.DB_NAME
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
            request = new Request(`select * from [dbo].[cs361_project] where id=${req.body.id}`, (rowCount) => {
                console.log(rowCount);
                if (rowCount == 0 || rowCount > 1) {
                    Bluebird.resolve(null);
                }
            });
            connection.execSql(request);
            request.on('row', (columns) => {
                Bluebird.resolve(columns)
            })
        } else {
            Bluebird.reject("Malformed post");
        }
    }).then((columns) => {
        console.log('columns: ');
        console.log(columns);
        let query = '';
        if (columns) {
            user = rows[0];
            query += `update [dbo].[cs361_project] set user_token=${req.body.token} where id=${req.body.id}`;
        } else {
            query += `insert into [dbo].[cs361_project] (id, full_name, given_name, image_url, email, id_token) values (${req.body.id}, ${req.body.full_name ? `'${req.body.full_name}'` : 'null'}, ${req.body.given_name ? `'${req.body.given_name}'` : 'null'}, ${req.body.image_url ? `'${req.body.image_url}'` : 'null'}, ${req.body.email ? `'${req.body.email}'` : 'null'}, '${req.body.token}')`;
        }
        console.log(query);
        let request = new Request(query, (rowCount) => {
            Bluebird.resolve(rowCount);
        });
        connection.execSql(request);
    }).then((rowCount) => {
        console.log(rowCount);
        if (rowCount == 1) {
            res.status(200).send("successfully added/updated user");
        } else {
            res.status(400).send("failed to add/update user, server failure");
        }
    }).catch((err) => {
        console.log(err);
        res.status(401).send(err);
    })
});

var Debug = require('./debug.js').with(connection);
app.use('/debug', Debug);

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