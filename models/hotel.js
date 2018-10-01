
var mongoose = require('mongoose');
var user = require('./user');

var room = new mongoose.Schema({
    roomno : Number,
    booked : Boolean,
    start_date : Date,
    end_date : Date,
    bookie : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

var HotelSchema = new  mongoose.Schema({
    name: String,
    address : String,
    totalroom : Number,
    rooms : [room]
});


var Hotel = mongoose.model('hotel', HotelSchema);

module.exports.Hotel = Hotel;