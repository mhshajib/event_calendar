var express = require('express');
var router = express.Router();
var Event = require('../models/event');

//User Register
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
            res.json({status: 2000, message: "Event Saved Successfully", data: event});
        }
    });
});

module.exports = router;
