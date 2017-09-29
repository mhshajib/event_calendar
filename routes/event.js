var express = require('express');
var router = express.Router();
var Event = require('../models/event');

//Fetch Events
router.get('/', function (req, res) {
    Event.fetchEvents({year: req.query.year, month: req.query.month},function (err, events) {
        if(err){
            res.json({status: 4000, errors: errors});
        }else{
            res.json({status: 2000, data: events});
        }
    });
});
//Create Event
router.post('/create', function (req, res) {
    var newEvent = new Event({
        year: req.body.year,
        month: req.body.month,
        date: req.body.date,
        weeksIndex: req.body.weeksIndex,
        dayIndex: req.body.dayIndex,
        title: req.body.title,
        description: req.body.description
    });
    Event.createEvent(newEvent, function (err, event) {
        if(err){
            res.json({status: 4000, errors: errors});
        }else{
            res.json({status: 2001, message: "Event Saved Successfully", data: event});
        }
    });
});

//Create Event
router.put('/:id/edit', function (req, res) {
    Event.editEvent({id: req.params.id, title: req.body.title, description: req.body.description}, function (err, event) {
        if(err){
            res.json({status: 4000, errors: errors});
        }else{
            res.json({status: 2002, message: "Event Updated Successfully", data: event});
        }
    });
});

module.exports = router;
