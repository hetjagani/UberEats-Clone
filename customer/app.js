const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();

const expressSwagger = require("express-swagger-generator")(app);
const authMiddleware = require("./util/authMiddleware");

const customerRouter = require("./routes/customer.routes");
const mediaRouter = require("./routes/media.routes");

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

let options = {
    swaggerDefinition: {
        info: {
            description: "Customer Information Server for Uber Eats",
            title: "Customer Information Server",
            version: "1.0.0",
        },
        host: "localhost:7002",
        produces: ["application/json"],
        schemes: ["http"],
    },
    // eslint-disable-next-line no-undef
    basedir: __dirname,
    files: ["./routes/**/*.js"], //Path to the API handle folder
};

expressSwagger(options);

app.use(authMiddleware);

app.use("/customers", customerRouter);
app.use("/media", mediaRouter);

module.exports = app;
