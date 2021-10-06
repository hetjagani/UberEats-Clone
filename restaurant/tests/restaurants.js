/* eslint-disable global-require */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

chai.should();
chai.use(chaiHttp);

let app;
describe('POST /auth/signup', () => {
  before((done) => {
    require('../config');
    const { initDB } = require('../db');
    initDB()
      .then(() => {
        const { runMigration } = require('../model');
        return runMigration(true);
      })
      .then(() => {
        app = require('../app');
        done();
      });
  });

  beforeEach(() => {
    nock(`${global.gConfig.auth_url}`)
      .get('/auth/validate')
      .query({ token: 'admin' })
      .reply(200, { valid: true, role: 'restaurant', user: 1 });
  });

  it('it should create a restaurant', (done) => {
    const data = {
      id: 1,
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
      .set('Authorization', 'admin')
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
          res.body.should.have.property('time_open').eql('10:00:00');
          res.body.should.have.property('time_close').eql('20:00:00');
          res.body.should.have.property('food_type').eql('veg');
          res.body.should.have.property('restaurant_type').eql('delivery');
        }
        done();
      });
  });

  it('it should fetch the created restaurant', (done) => {
    chai
      .request(app)
      .get('/restaurants/1')
      .set('Authorization', 'admin')
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
          res.body.should.have.property('time_open').eql('10:00:00');
          res.body.should.have.property('time_close').eql('20:00:00');
          res.body.should.have.property('food_type').eql('veg');
          res.body.should.have.property('restaurant_type').eql('delivery');
        }
        done();
      });
  });

  it('it should update the restaurant', (done) => {
    const data = {
      id: 1,
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
      .put('/restaurants/1')
      .send(data)
      .set('Authorization', 'admin')
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
          res.body.should.have.property('time_open').eql('08:00:00');
          res.body.should.have.property('time_close').eql('22:00:00');
          res.body.should.have.property('food_type').eql('non-veg');
          res.body.should.have.property('restaurant_type').eql('pickup');
        }
        done();
      });
  });
});
