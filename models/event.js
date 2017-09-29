var mongoose = require('mongoose');

//Event Schema
var EventSchema = mongoose.Schema({
    year: {type: Number},
    month: {type: Number},
    date: {type: Number},
    weeksIndex: {type: Number},
    dayIndex: {type: Number},
    title: {type: String},
    description: {type: String}
});

var Event = module.exports = mongoose.model('Event', EventSchema);

//Fetch all Events
module.exports.fetchEvents = function(date, callback){
    Event.find({year: date.year, month: date.month}, callback);
};

//Create Event
module.exports.createEvent = function(newEvent, callback){
    newEvent.save(callback);
};

//Edit Event
module.exports.editEvent = function(eventData, callback){
    Event.findById(eventData.id, function (err, event) {
        event.title = eventData.title;
        event.description = eventData.description;
        event.save(callback);
    });
};