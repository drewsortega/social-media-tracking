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

// query to GET user profile info from Google -- unsure where this should fit in
// fetch(
//     'https://www.googleapis.com/userinfo/v2/me',         {
//         method: 'GET',
//         headers: {
//             'Content-length': 0,
//             'Authorization': 'Bearer <OUR RETURNED TOKEN>
//         }
//     }
// )
// .then(res => res.json())
// .then(console.log)

app.post('/auth/login_signup', (req, res) => {
    console.log(req.body);
    let user = {};
    new Bluebird.Promise((resolve, reject) => {
        if (req.body && !_.isNull(req.body.id) && _.isNumber(+req.body.id)
            && !_.isNull(req.body.full_name) && _.isString(req.body.full_name)
            && !_.isNull(req.body.email) && _.isString(req.body.email)
            && !_.isNull(req.body.token) && _.isString(req.body.token)
        ) {
            request = new Request(`select * from [dbo].[cs361_project] where id=${req.body.id}`, (rowCount) => {
                console.log(rowCount);
                if (rowCount == 0 || rowCount > 1) {
                    resolve(null);
                }
            });
            connection.execSql(request);
            request.on('row', (columns) => {
                resolve(columns)
            })
        } else {
            reject("Malformed post");
        }
    }).then((columns) => {
        return new Bluebird.Promise((resolve, reject) => {
            try {
                console.log('columns: ');
                console.log(columns);
                let query = '';
                if (columns) {
                    query += `update [dbo].[cs361_project] set user_token='${req.body.token}' where id=${req.body.id}`;
                } else {
                    query += `insert into [dbo].[cs361_project] (id, full_name, given_name, image_url, email, user_token) values (${req.body.id}, ${req.body.full_name ? `'${req.body.full_name}'` : 'null'}, ${req.body.given_name ? `'${req.body.given_name}'` : 'null'}, ${req.body.image_url ? `'${req.body.image_url}'` : 'null'}, ${req.body.email ? `'${req.body.email}'` : 'null'}, '${req.body.token}')`;
                }
                console.log(query);
                let request = new Request(query, (rowCount) => {
                    resolve(rowCount);
                });
                connection.execSql(request);
            } catch(err) {
                reject("failed to finish sql query");
            }
        });
    }).then((rowCount) => {
        console.log(rowCount);
        res.status(200).send("successfully added/updated user");
    }).catch((err) => {
        console.log(err);
        res.status(401).send(err);
    })
});


app.get('/auth/login_retrieve/:user_token', (req, res) => {

    let token = req.params.user_token;

    if (token.length < 1 || token.length > 200 || !/^[\w.-]+$/.test(token)) { 
        // Malformed post
        res.status(401).send('{}');
        return;
    }

    new Bluebird.Promise((resolve, reject) => {

        request = new Request(` \
            select given_name, image_url \
            from [dbo].[cs361_project] \ 
            where id_token='${token}'`, (err, rowCount) => {
            if (err) {
                console.log("login_retrieve failure:");
                console.log(err);
                reject(err);
            }
            if (rowCount == 0) {
                resolve(null);
            }
        });

        request.on('row', (columns) => {
            resolve(columns);
        });

        connection.execSql(request);

    }).then((columns) => {

        if (columns) {
            response = {};
            response.given_name = columns[0].value;
            response.image_url = columns[1].value;
            res.status(200).send(JSON.stringify(response));
        } else {
            res.status(404).send({});
        }
        
    }).catch((err) => {
        console.log(err);
        res.status(401).send('{}');
    })
});


var Debug = require('./debug.js').with(connection);
app.use('/debug', Debug);



connection.on('connect', function (err) {
    if (err) {
        console.log("FATAL: Database failed to connect:");
        console.log(err);
        process.exit(1);
    } else {
        console.log("Connected to database.");
    }
});

connection.on('end', function () {
    console.log("Database connection ended. Trying to reconnect.");
    connection = new Connection(db_config);
});

connection.on('error', function (err) {
    console.log("FATAL: Database connection error:");
    console.log(err);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
