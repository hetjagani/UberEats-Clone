const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const bodyParser = require('body-parser')

const app = express();

const expressSwagger = require("express-swagger-generator")(app);

// all middlewares
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.get("/hello", (req, res) => {
    res.send("Hello from restaurant");
});

let options = {
    swaggerDefinition: {
        info: {
            description: "Restaurant Information Server for Uber Eats",
            title: "Restaurant Information Server",
            version: "1.0.0",
        },
        host: "localhost:7001",
        produces: ["application/json"],
        schemes: ["http"],
        securityDefinitions: {
            JWT: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
                description: "",
            },
        },
    },
    // eslint-disable-next-line no-undef
    basedir: __dirname,
    files: ["./routes/**/*.js"], //Path to the API handle folder
};

expressSwagger(options);

module.exports = app;
