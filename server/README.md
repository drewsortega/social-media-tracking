# Social Media Tracking - Server

## Installation

1) Clone this repository to your local machine
1) Navigate to social-media-tracking/server
1) - dev: run `npm install`.
    - prod: run `npm install --only=prod`

Server is now installed on your machine.

## Starting the server

1) Set environment variables:

    - _option 1:_ copy .env-sample to .env, then fill missing fields (PORT, DB_USERNAME, DB_PASSWORD)

    - _option 2:_ set environment variables in your terminal, doing:
    
        ```bash
        export PORT=PORT_HERE
        export DB_USERNAME=USERNAME_HERE
        export DB_PASSWORD=PASSWORD_HERE
        ```
1) - dev: run `npm run debug`
    - prod: run `npm start`

The server is now running on the machine.

## Running Unit tests

1) Make sure server was installed using `npm install`, without --only=prod tag.
1) - just unit tests: run `npm test`
    - unit tests with code coverage: run `npm run coverage`
