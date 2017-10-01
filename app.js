var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/event_calendar', { useMongoClient: true});
var EventModel = require('./models/event');

//Initializing app
var app = express();

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Creating http server
var server = require('http').createServer(app);

//Initializing socket
var io = require('socket.io').listen(server);

//Routes
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// Calling event routes when request first param is event
app.get('/events', function (req, res) {
    EventModel.fetchEvents({year: req.query.year, month: req.query.month},function (err, events) {
        if(err){
            res.json({status: 4000, errors: errors});
        }else{
            res.json({status: 2000, data: events});
        }
    });
});
//Create Event
app.post('/events', function (req, res) {
    var newEvent = new EventModel({
        year: req.body.year,
        month: req.body.month,
        date: req.body.date,
        weeksIndex: req.body.weeksIndex,
        dayIndex: req.body.dayIndex,
        title: req.body.title,
        description: req.body.description
    });
    EventModel.createEvent(newEvent, function (err, event) {
        if(err){
            res.json({status: 4000, message: "Failed to create event"});
        }else{
            //Broadcasting to all when a new event successfully created
            io.sockets.emit('create_event', event);
            res.json({status: 2001, message: "Event created successfully", data: event});
        }
    });
});

//Edit Event
app.put('/events/:id', function (req, res) {
    EventModel.editEvent({id: req.params.id, title: req.body.title, description: req.body.description}, function (err, event) {
        if(err){
            res.json({status: 4000, message: "Failed to update event"});
        }else{
            //Broadcasting to all when an event get updated
            io.sockets.emit('edit_event', req.body);
            res.json({status: 2002, message: "Event updated successfully", data: req.body});
        }
    });
});

//Delete Event
app.delete('/events/:id', function (req, res) {
    EventModel.deleteEvent(req.params.id, function (err, event) {
        if(err){
            res.json({status: 4000, message: "Failed to delete event"});
        }else{
            //Broadcasting to all when an event deleted
            io.sockets.emit('delete_event', req.query);
            res.json({status: 2003, message: "Event deleted successfully"});
        }
    });
});


//Set Port
app.set('port',3300);

//Checking mongodb connection
mongoose.connection.on('error', function(err) {
    console.log('Mongodb is not running.');
    process.exit();
}).on('connected', function() {
    server.listen(app.get('port'), function() {
        console.log('Server started at : http://localhost:' + app.get('port'));
    });
});
module.exports = app; // for testing