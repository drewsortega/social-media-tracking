let chai = require('chai');
let expect = chai.expect;

let request = require('request');

describe('Header', function () {
    describe('sub header', function () {
        it('should compare two equal strings', function () {
            expect('some text').to.equal('some text');
        })
    })
})

describe('server', function() {

    var server_url = "http://localhost:54102/auth/login_retrieve/";

    describe('auth', function() {
        describe('login_retrieve', function() {

            it('rejects tokens with punctuation', function(done) {
                
                request(server_url + '12345$1', function(error, response, body) {
                    expect(response.statusCode).to.equal(401);
                    done();
                });
            });
        });
    });
});
