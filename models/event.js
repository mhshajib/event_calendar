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

//Export as createEvent
module.exports.createEvent = function(newEvent, callback){
    newEvent.save(callback);
};