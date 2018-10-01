
const express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var hotelRoutes = require('./routes/hotel');
var userRoutes = require('./routes/user');

mongoose.promise = global.Promise;

mongoose.connect('mongodb://localhost/Hotels');

mongoose.connection.on("open", function(ref) {
    console.log("Connected to mongo server.");
});
  
mongoose.connection.on("error", function(err) {
   console.log("Could not connect to mongo server!");
});
 
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    console.log(req.method + '   ' + req.originalUrl);
    next();
});

app.use('/hotel', hotelRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
  
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message
      }
    });
});
  
var port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('Server started listening on :' + port);
});