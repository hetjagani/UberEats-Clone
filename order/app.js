const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const expressSwagger = require('express-swagger-generator')(app);

const authMiddleware = require('./util/authMiddleware');
const cartitemRouter = require('./routes/cartitem.routes');

// all middlewares
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const options = {
  swaggerDefinition: {
    info: {
      description: 'Order Information Server for Uber Eats',
      title: 'Order Information Server',
      version: '1.0.0',
    },
    host: 'localhost:7003',
    produces: ['application/json'],
    schemes: ['http'],
  },
  // eslint-disable-next-line no-undef
  basedir: __dirname,
  files: ['./routes/**/*.js'], // Path to the API handle folder
};

expressSwagger(options);

app.use(authMiddleware);

app.use('/cartitems', cartitemRouter);

module.exports = app;
