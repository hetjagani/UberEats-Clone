const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");

const helloController = require("./controller/users");

const app = express();

const expressSwagger = require("express-swagger-generator")(app);

// all middlewares
app.use(logger("dev"));
app.use(cookieParser());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use("/users", helloController);

let options = {
    swaggerDefinition: {
        info: {
            description: "Authentication Server for Uber Eats",
            title: "Authentication Server",
            version: "1.0.0",
        },
        host: "localhost:7000",
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
    basedir: __dirname,
    files: ["./controller/**/*.js"], //Path to the API handle folder
};

expressSwagger(options);

module.exports = app;
