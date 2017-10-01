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
            .query({year: 2017, month: 10})
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('data');
                done();
            });
    });
});

describe('/POST event', function() {
    it('it should create a new event', function(done) {
        chai.request(server)
            .post('/events')
            .send({'year': 2017, 'month': 10, 'date': 4, "weeksIndex": 0, "dayIndex": 3, "title": "Test Event", "description": "Test Event Description" })
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('_id');
                res.body.data.should.have.property('year');
                res.body.data.should.have.property('month');
                res.body.data.should.have.property('date');
                res.body.data.should.have.property('weeksIndex');
                res.body.data.should.have.property('dayIndex');
                res.body.data.should.have.property('title');
                res.body.data.should.have.property('description');
                res.body.data.title.should.equal('Test Event');
                res.body.data.description.should.equal('Test Event Description');
                done();
            });
    });
});

describe('/PUT event/<id>', function() {
    it('it should update an event', function(done) {
        chai.request(server)
            .get('/events')
            .query({year: 2017, month: 10})
            .end(function(err, res){
                chai.request(server)
                    .put('/events/'+res.body.data[0]._id)
                    .send({'title': 'Updated Title', 'description': 'Updated Description'})
                    .end(function(error, response){
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('status');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data');
                        response.body.data.should.be.a('object');
                        response.body.data.should.have.property('title');
                        response.body.data.should.have.property('description');
                        done();
                    });
            });
    });
});

describe('/DELETE event/<id>', function() {
    it('it should delete an event', function(done) {
        chai.request(server)
            .get('/events')
            .query({year: 2017, month: 10})
            .end(function(err, res){
                chai.request(server)
                    .delete('/events/'+res.body.data[0]._id)
                    .end(function(error, response){
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('status');
                        response.body.should.have.property('message');
                        done();
                    });
            });
    });
});
