var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/event_calendar', { useMongoClient: true});

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
// var io = require('socket.io').listen(server);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


// Calling event routes when request first param is event
app.use('/events', require('./routes/event'));

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
