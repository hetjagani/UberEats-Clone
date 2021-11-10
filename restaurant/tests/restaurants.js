/* eslint-disable camelcase */
/* eslint-disable global-require */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { Types } = require('mongoose');
const nock = require('nock');
require('../config');
const sinon = require('sinon');
const { initDB } = require('../db');
const { Restaurant } = require('../model');
const kafkaClient = require('../util/kafka/client');

chai.should();
chai.use(chaiHttp);

describe('Restaurant Testcases', () => {
  before((done) => {
    initDB();
    Restaurant.deleteMany({}).then(() => {
      done();
    });
  });

  beforeEach(() => {
    nock(`${global.gConfig.auth_url}`)
      .get('/auth/validate')
      .query({ token: 'secrettoken' })
      .reply(200, { valid: true, role: 'restaurant', user: '616eee906f354a1864dc650d' });

    stb = sinon.stub(kafkaClient, 'makeRequest').callsFake((queue_name, msg_payload, callback) => {
      if (queue_name === 'restaurant.create') {
        Restaurant.create(msg_payload)
          .then((d) => {
            callback(null, d);
          })
          .catch((err) => {
            callback(err, null);
          });
      }
      if (queue_name === 'restaurant.update') {
        Restaurant.updateOne({ _id: Types.ObjectId(msg_payload.id) }, msg_payload.data)
          .then(() => {
            callback(null, { _id: msg_payload.id });
          })
          .catch((err) => {
            callback(err, null);
          });
      }
    });
    app = require('../app');
  });

  afterEach(() => {
    stb.restore();
  });

  it('it should create a restaurant', (done) => {
    const data = {
      id: '616eee906f354a1864dc650d',
      name: 'Test Restaurant',
      description: 'Test Description',
      address: 'Test Address',
      city: 'San Jose',
      state: 'California',
      country: 'USA',
      contact_no: '89898989856',
      time_open: '10:00',
      time_close: '20:00',
      food_type: 'veg',
      restaurant_type: 'delivery',
    };

    chai
      .request(app)
      .post('/restaurants')
      .send(data)
      .set('Authorization', 'secrettoken')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(201);
          res.body.should.have.property('name').eql('Test Restaurant');
          res.body.should.have.property('description').eql('Test Description');
          res.body.should.have.property('address').eql('Test Address');
          res.body.should.have.property('city').eql('San Jose');
          res.body.should.have.property('state').eql('California');
          res.body.should.have.property('country').eql('USA');
          res.body.should.have.property('contact_no').eql('89898989856');
          res.body.should.have.property('time_open').eql('10:00');
          res.body.should.have.property('time_close').eql('20:00');
          res.body.should.have.property('food_type').eql('veg');
          res.body.should.have.property('restaurant_type').eql('delivery');
        }
        done();
      });
  });

  it('it should fetch the created restaurant', (done) => {
    chai
      .request(app)
      .get('/restaurants/616eee906f354a1864dc650d')
      .set('Authorization', 'secrettoken')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(200);
          res.body.should.have.property('name').eql('Test Restaurant');
          res.body.should.have.property('description').eql('Test Description');
          res.body.should.have.property('address').eql('Test Address');
          res.body.should.have.property('city').eql('San Jose');
          res.body.should.have.property('state').eql('California');
          res.body.should.have.property('country').eql('USA');
          res.body.should.have.property('contact_no').eql('89898989856');
          res.body.should.have.property('time_open').eql('10:00');
          res.body.should.have.property('time_close').eql('20:00');
          res.body.should.have.property('food_type').eql('veg');
          res.body.should.have.property('restaurant_type').eql('delivery');
        }
        done();
      });
  });

  it('it should update the restaurant', (done) => {
    const data = {
      name: 'Test Updated Restaurant',
      description: 'Test Updated Description',
      address: 'Test Updated Address',
      city: 'Fremont',
      state: 'California',
      country: 'USA',
      contact_no: '9898989898',
      time_open: '08:00',
      time_close: '22:00',
      food_type: 'non-veg',
      restaurant_type: 'pickup',
    };

    chai
      .request(app)
      .put('/restaurants/616eee906f354a1864dc650d')
      .send(data)
      .set('Authorization', 'secrettoken')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(200);
          res.body.should.have.property('name').eql('Test Updated Restaurant');
          res.body.should.have.property('description').eql('Test Updated Description');
          res.body.should.have.property('address').eql('Test Updated Address');
          res.body.should.have.property('city').eql('Fremont');
          res.body.should.have.property('state').eql('California');
          res.body.should.have.property('country').eql('USA');
          res.body.should.have.property('contact_no').eql('9898989898');
          res.body.should.have.property('time_open').eql('08:00');
          res.body.should.have.property('time_close').eql('22:00');
          res.body.should.have.property('food_type').eql('non-veg');
          res.body.should.have.property('restaurant_type').eql('pickup');
        }
        done();
      });
  });
});
