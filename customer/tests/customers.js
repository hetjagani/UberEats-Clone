/* eslint-disable global-require */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

chai.should();
chai.use(chaiHttp);

let app;
describe('Customer Testcases', () => {
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
      .query({ token: 'secrettoken' })
      .reply(200, { valid: true, role: 'customer', user: 1 });
  });

  it('it should create a customer', (done) => {
    const data = {
      id: 1,
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

  it('it should fetch the created restaurant', (done) => {
    chai
      .request(app)
      .get('/customers/1')
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

  it('it should update the restaurant', (done) => {
    const data = {
      id: 1,
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
      .put('/customers/1')
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
