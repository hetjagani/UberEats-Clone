/* eslint-disable camelcase */
/* eslint-disable global-require */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
require('../config');
const { Types } = require('mongoose');
const sinon = require('sinon');
const { initDB } = require('../db');
const kafkaClient = require('../util/kafka/client');
const { Customer } = require('../model');

chai.should();
chai.use(chaiHttp);

let app;
describe('Customer Testcases', () => {
  before((done) => {
    initDB();
    Customer.deleteMany({}).then(() => {
      done();
    });
  });

  beforeEach(() => {
    nock(`${global.gConfig.auth_url}`)
      .get('/auth/validate')
      .query({ token: 'secrettoken' })
      .reply(200, { valid: true, role: 'customer', user: '616eee906f354a1864dc650d' });

    stb = sinon.stub(kafkaClient, 'makeRequest').callsFake((queue_name, msg_payload, callback) => {
      if (queue_name === 'customer.create') {
        Customer.create(msg_payload)
          .then((d) => {
            callback(null, d);
          })
          .catch((err) => {
            callback(err, null);
          });
      }
      if (queue_name === 'customer.update') {
        Customer.updateOne({ _id: Types.ObjectId(msg_payload.id) }, msg_payload.data)
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

  it('it should create a customer', (done) => {
    const data = {
      id: '616eee906f354a1864dc650d',
      name: 'Test Customer',
      nickname: 'TestNickname',
      about: 'Test About',
      city: 'San Jose',
      state: 'California',
      country: 'USA',
      contact_no: '8989898985',
    };
    chai
      .request(app)
      .post('/customers')
      .send(data)
      .set('Authorization', 'secrettoken')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(201);
          res.body.should.have.property('name').eql('Test Customer');
          res.body.should.have.property('nickname').eql('TestNickname');
          res.body.should.have.property('about').eql('Test About');
          res.body.should.have.property('city').eql('San Jose');
          res.body.should.have.property('state').eql('California');
          res.body.should.have.property('country').eql('USA');
          res.body.should.have.property('contact_no').eql('8989898985');
        }
        done();
      });
  });

  it('it should fetch the created customer', (done) => {
    chai
      .request(app)
      .get('/customers/616eee906f354a1864dc650d')
      .set('Authorization', 'secrettoken')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(200);
          res.body.should.have.property('name').eql('Test Customer');
          res.body.should.have.property('nickname').eql('TestNickname');
          res.body.should.have.property('about').eql('Test About');
          res.body.should.have.property('city').eql('San Jose');
          res.body.should.have.property('state').eql('California');
          res.body.should.have.property('country').eql('USA');
          res.body.should.have.property('contact_no').eql('8989898985');
        }
        done();
      });
  });

  it('it should update the customer', (done) => {
    const data = {
      id: '616eee906f354a1864dc650d',
      name: 'Test Updated Customer',
      nickname: 'TestUpdatedNickname',
      about: 'Test Updated About',
      city: 'Fremont',
      state: 'California',
      country: 'USA',
      contact_no: '9898989898',
    };
    chai
      .request(app)
      .put('/customers/616eee906f354a1864dc650d')
      .send(data)
      .set('Authorization', 'secrettoken')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(200);
          res.body.should.have.property('name').eql('Test Updated Customer');
          res.body.should.have.property('nickname').eql('TestUpdatedNickname');
          res.body.should.have.property('about').eql('Test Updated About');
          res.body.should.have.property('city').eql('Fremont');
          res.body.should.have.property('state').eql('California');
          res.body.should.have.property('country').eql('USA');
          res.body.should.have.property('contact_no').eql('9898989898');
        }
        done();
      });
  });
});
