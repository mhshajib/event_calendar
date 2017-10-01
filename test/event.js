let mongoose = require("mongoose");
let Event = require('../models/event');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Events', function() {
    it("this function must remove all data from events", function () {
        Event.remove(function (err, event) {
            return event;
        });
    });
});

describe('/GET events', function() {
    it('it should GET all the events', function(done) {
        chai.request(server)
            .get('/events')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('data');
                done();
            });
    });
});