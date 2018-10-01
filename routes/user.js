
var express = require('express');
var router = express.Router();

var {User} = require('../models/user');
var {Hotel} = require('../models/hotel');

router.post('/', (req, res) => {
    var newUser = new User({
        name : req.body.name
    });

    newUser.save()
    .then((user) => {
        res.send({user});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send();
    });
});

router.put('/:userId', (req, res) => {
    var id = req.params.userId;

    User.findById(id)
    .then((user)=>{
        if(!user) {
            return res.status(404).send();
        }
        user.name = req.body.name;
        user.save()
        .then((updatedUser)=>{
            res.send({updatedUser})
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).send();
        });
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).send();
    });
});

router.delete('/:userId', (req, res) => {
    var id = req.params.userId;

    User.findByIdAndRemove(id)
    .then((removedUser)=>{
        if(!removedUser){
            return res.send(404);
        }

        res.send({removedUser});
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).send();
    });
});

router.post('/bookroom/:userId/:hotelId', (req, res) => {
    var usedId = req.params.userId;
    var hotelId = req.params.hotelId;

    User.findById(usedId)
    .then((user) => {
        if(!user){
            return res.send(404);
        }
        Hotel.findById(hotelId)
        .then((hotel)=>{
            if(!hotel){
                return res.send(404);
            }
            var roomIndex = req.body.roomno - 1;

            if(hotel.rooms[roomIndex] && ! hotel.rooms[roomIndex].booked) {
                hotel.rooms[roomIndex].booked = true;
                hotel.rooms[roomIndex].start_date = req.body.startdate;
                hotel.rooms[roomIndex].end_date = req.body.enddate;
                hotel.rooms[roomIndex].bookie = user._id;

                hotel.save()
                .then((hotelDoc)=>{
                    res.send(hotelDoc);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(404).send();
                });
            } else {
                res.send('Room is Not available for now');
            }
        })
        .catch((err)=>{
            console.log(err);
            res.status(400).send();
        });
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).send();
    });
});

module.exports = router;