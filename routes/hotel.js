
var express = require('express');
var router = express.Router();

var {Hotel} = require('../models/hotel');
var ObjectId = require('mongodb').ObjectID;

router.get('/', (req, res) => {
    Hotel.find({})
    .then((hotels) => {
        res.send({hotels});
      })
    .catch((err)=>{
        console.log(err);
        res.status(404).send();
      });
});

router.post('/', (req, res) => {
    var newhotel = new Hotel({name:req.body.name, address: req.body.address, totalroom : 0, rooms:[]});
    newhotel.save()
    .then((hotel) => {
        console.log('Created Successfully : ' + hotel.name);
        res.send({hotel});
    })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
    });
});

router.put('/:hotelId', (req, res) => {
    var id = req.params.hotelId;
    Hotel.findById(id)
    .then((hotel)=>{
        if(!hotel) {
            return res.status(404).send();
        }
        hotel.name = req.body.name;
        hotel.address = req.body.address;
        hotel.save()
        .then((updatedHotel) => {
            console.log('hotel Info updated :' + updatedHotel);
            res.send(updatedHotel);
        });
    })
    .catch(() => {
        res.send(400);
    });
});

router.delete('/:hotelId', (req, res) => {
    var id = req.params.hotelId;

    Hotel.findByIdAndRemove(id)
    .then((removedHotel)=>{
        if(!removedHotel) {
            return res.send(404);
        }

        res.send({removedHotel});
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).send();
    });
});

router.post('/:hotelId/createroom', (req, res) => {
    var id = req.params.hotelId;

    Hotel.findById(id)
    .then((hotel)=> {
        if(!hotel) {
            return res.status(404).send();
        }

        hotel.totalroom = hotel.totalroom + 1;
        var room = {
            roomno : hotel.totalroom,
            booked : false,
            start_date : null,
            end_date : null,
            bookie : null
        };

        hotel.rooms.push(room);
        hotel.save()
        .then((newHotelDoc) =>{
            res.send(newHotelDoc);
        })
        .catch((err) => {
            console.log(err);
            res.send(500);
        });
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).send();
    });
});

router.get('/getavailrooms/:hotelId', (req, res) => {
    var id = req.params.hotelId;
    var startdate = req.query.start_date;
    var enddate = req.query.end_date;
    console.log(id)
    Hotel.aggregate([
        {$match: {_id:ObjectId(id)}},
        {$unwind: {path: "$rooms"}},
        {$match :
            { $or: [{"rooms.start_date" :{$lt : new Date(startdate)},"rooms.end_date":{$lt: new Date(startdate)}}, 
            {"rooms.start_date" :{$gt : new Date(enddate)},"rooms.end_date":{$gt: new Date(enddate)}},
            {"rooms.start_date" : null , "rooms.end_date" : null}]}},
        { $group : {_id: { HotelName: "$name", Room_No : "$rooms.roomno"}}}
    ]).then((result)=>{
        res.send(result);
    }).catch((err)=> {
        console.log(err);
        res.status(404).send();
    });
});


module.exports = router;