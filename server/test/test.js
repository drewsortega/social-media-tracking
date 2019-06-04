let chai = require('chai');
let expect = chai.expect;

describe('Header', function () {
    describe('sub header', function () {
        it('should compare two equal strings', function () {
            expect('some text').to.equal('some text');
        })
    })
})