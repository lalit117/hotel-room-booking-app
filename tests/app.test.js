
var request = require('supertest');
var expect = require('expect');

var app = require('../app');

const {Hotel} = require('../models/hotel');
const {User} = require('../models/user');

var totalDoc = 0;
beforeEach((done) => {
    Hotel.count().then((num)=>{
        totalDoc = num;
        done();
    });
});

describe('GET /hotel', () => {

    it('Should Return all hotels', (done) => {
        request(app)
        .get('/hotel')
        .expect(200)
        .expect((res)=>{
            expect(res.body.hotels.length).toBe(totalDoc);
        })
        .end(done);
    });
});


describe('post /hotel', () => {
    var id;
    var hotel = {
        name : "temp-hotel",
        address : "temp-address"
    };

    after((done) => {
        Hotel.findByIdAndRemove(id)
        .then((doc)=>{
            expect(doc.name).toBe(hotel.name);
            expect(doc.address).toBe(hotel.address);
            done();
        })
        .catch((e) => done(e));
    });

    it('Should add new hotel', (done) => {
        request(app)
        .post('/hotel')
        .send(hotel)
        .expect(200)
        .expect((res)=>{
            expect(res.body.hotel.name).toBe(hotel.name);
            expect(res.body.hotel.address).toBe(hotel.address);
            id = res.body.hotel._id;
        })
        .end((err, res)=>{
            if(err) {
                return done(err);
            }

            Hotel.findById(id).then((doc) => {
                expect(doc.name).toBe(hotel.name);
                expect(doc.address).toBe(hotel.address);
                done();
            }).catch((e)=> done(e));
        });
    });
});