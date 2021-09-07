const http = require("http");
const _ = require("./config");
const { initDB } = require("./db");

initDB()
    .then(() => {
        const { runMigration } = require("./model");
        return runMigration();
    })
    .then(() => {
        const app = require("./app");
        const port = process.env.PORT || "3000";
        app.set("port", port);
        var server = http.createServer(app);
        server.listen(port);
        server.on("error", (err) => {
            console.error(err);
        });
        server.on("listening", () => {
            console.log(`Server listening on ${server.address().port}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
