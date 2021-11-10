/* eslint-disable global-require */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
require('../config');
const { initDB } = require('../db');
const app = require('../app');
const { User } = require('../model');

chai.should();
chai.use(chaiHttp);

describe('POST /auth/signup', () => {
  before((done) => {
    initDB();
    done();
  });

  after((done) => {
    User.deleteMany({}).then(() => {
      done();
    });
  });

  it('it should create a new user', (done) => {
    const data = {
      email: 'testuser@gmail.com',
      password: 'Password123',
      role: 'customer',
    };
    chai
      .request(app)
      .post('/auth/signup')
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(200);
          res.body.should.have.property('token');
        }
        done();
      });
  });

  let token = '';
  it('it should login with the new user', (done) => {
    const data = {
      email: 'testuser@gmail.com',
      password: 'Password123',
    };
    chai
      .request(app)
      .post('/auth/login')
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(200);
          res.body.should.have.property('token');
          token = res.body.token;
        }
        done();
      });
  });

  it('it should validate the token', (done) => {
    chai
      .request(app)
      .get('/auth/validate')
      .query({ token })
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          res.should.have.status(200);
          res.body.should.have.property('valid').eql(true);
          res.body.should.have.property('role').eql('customer');
        }
        done();
      });
  });
});
