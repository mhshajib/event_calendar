var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/event_calendar', { useMongoClient: true});

//Init app
var app = express();

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set statuc folder
app.use(express.static(path.join(__dirname, 'public')));

var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
	// res.json({"name": "Sajib", "age": "26"});
});

//Set Port
app.set('port',3300);

mongoose.connection.on('error', function(err) {
    console.log('Mongodb is not running.');
    process.exit();
}).on('connected', function() {
    server.listen(app.get('port'), function() {
        console.log('Server started at : http://localhost:' + app.get('port'));
    });
});
